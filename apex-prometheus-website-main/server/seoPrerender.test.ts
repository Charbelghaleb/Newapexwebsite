import { describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { seoPrerender, seoPrerenderTest } from "./seoPrerender";

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    path: "/",
    query: {},
    originalUrl: "/",
    ...overrides,
  } as unknown as Request;
}

function createMockRes() {
  const res = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: "",
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    set(headers: Record<string, string>) {
      res.headers = { ...res.headers, ...headers };
      return res;
    },
    end(body: string) {
      res.body = body;
      return res;
    },
  };
  return res as unknown as Response & { body: string; statusCode: number; headers: Record<string, string> };
}

describe("seoPrerender middleware", () => {
  it("serves pre-rendered HTML to Googlebot for homepage", () => {
    const req = createMockReq({
      headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
      path: "/",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("Survive &amp; Thrive with AI");
    expect(res.body).toContain('<meta name="robots" content="index, follow">');
    expect(res.body).toContain("application/ld+json");
    expect(res.body).toContain("https://schema.org");
  });

  it("passes through for normal users (no crawler UA)", () => {
    const req = createMockReq({
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" },
      path: "/",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.body).toBe("");
  });

  it("serves pre-rendered HTML for blog listing page", () => {
    const req = createMockReq({
      headers: { "user-agent": "Bingbot/2.0" },
      path: "/blog",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.body).toContain("Blog");
    expect(res.body).toContain("ai-boom-service-businesses-2026");
    expect(res.body).toContain("aeo-for-service-businesses");
  });

  it("serves pre-rendered HTML for blog article 1", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/blog/ai-boom-service-businesses-2026",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.body).toContain("The AI Boom Is Coming for Service Businesses");
    expect(res.body).toContain("$2.5 trillion");
  });

  it("serves pre-rendered HTML for manifesto", () => {
    const req = createMockReq({
      headers: { "user-agent": "facebookexternalhit/1.1" },
      path: "/manifesto",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.body).toContain("Blue Collar AI Manifesto");
    expect(res.body).toContain("Stan");
  });

  it("serves pre-rendered HTML for whitepaper", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/whitepaper",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.body).toContain("The AI Discovery Shift");
    expect(res.body).toContain("Answer Engine Optimization");
  });

  it("passes through for API routes even with crawler UA", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/api/trpc/auth.me",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("passes through for static assets even with crawler UA", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/assets/style.css",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("passes through for unknown routes with crawler UA", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/nonexistent-page",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("includes canonical URL in pre-rendered HTML", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/blog/aeo-for-service-businesses",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(res.body).toContain('rel="canonical" href="https://apexprometheus.ai/blog/aeo-for-service-businesses"');
  });

  it("includes Open Graph tags in pre-rendered HTML", () => {
    const req = createMockReq({
      headers: { "user-agent": "Googlebot" },
      path: "/",
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerender(req, res, next);

    expect(res.body).toContain('og:title');
    expect(res.body).toContain('og:description');
    expect(res.body).toContain('og:type');
    expect(res.body).toContain('og:url');
  });

  it("detects AI crawler user agents", () => {
    const aiCrawlers = [
      "OAI-SearchBot/1.0",
      "Claude-SearchBot/1.0",
      "PerplexityBot/1.0",
    ];

    for (const ua of aiCrawlers) {
      const req = createMockReq({
        headers: { "user-agent": ua },
        path: "/",
      });
      const res = createMockRes();
      const next = vi.fn();

      seoPrerender(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.body).toContain("Survive &amp; Thrive with AI");
    }
  });
});

describe("seoPrerenderTest middleware", () => {
  it("serves pre-rendered HTML when ?prerender=true", () => {
    const req = createMockReq({
      headers: { "user-agent": "Chrome" },
      path: "/",
      query: { prerender: "true" },
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerenderTest(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.body).toContain("Survive &amp; Thrive with AI");
  });

  it("passes through without ?prerender=true", () => {
    const req = createMockReq({
      headers: { "user-agent": "Chrome" },
      path: "/",
      query: {},
    });
    const res = createMockRes();
    const next = vi.fn();

    seoPrerenderTest(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
