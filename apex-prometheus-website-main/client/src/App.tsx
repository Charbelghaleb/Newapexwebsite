import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogArticle1 from "./pages/BlogArticle1";
import BlogArticle2 from "./pages/BlogArticle2";
import BlogArticle3 from "./pages/BlogArticle3";
import BlogArticle4 from "./pages/BlogArticle4";
import BlogArticle5 from "./pages/BlogArticle5";
import BlogArticle6 from "./pages/BlogArticle6";
import BlogArticle7 from "./pages/BlogArticle7";
import BlogArticle8 from "./pages/BlogArticle8";
import BlogArticle9 from "./pages/BlogArticle9";
import Manifesto from "./pages/Manifesto";
import Whitepaper from "./pages/Whitepaper";
import AIVisibilityScore from "./pages/AIVisibilityScore";
import ThankYou from "./pages/ThankYou";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/ai-visibility-score"} component={AIVisibilityScore} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/ai-boom-service-businesses-2026"} component={BlogArticle1} />
      <Route path={"/blog/aeo-for-service-businesses"} component={BlogArticle2} />
      <Route path={"/blog/ai-wont-replace-tradespeople"} component={BlogArticle3} />
      <Route path={"/blog/geo-strategy-trades-businesses-2026"} component={BlogArticle4} />
      <Route path={"/blog/7-ai-tools-every-trades-business-needs-2026"} component={BlogArticle5} />
      <Route path={"/blog/ai-data-center-boom-trades-business"} component={BlogArticle6} />
      <Route path={"/blog/customers-stopped-googling-aeo-revolution"} component={BlogArticle7} />
      <Route path={"/blog/ai-consulting-retainer-contractors-what-you-get"} component={BlogArticle8} />
      <Route path={"/blog/contractor-ai-adoption-doubled-2026"} component={BlogArticle9} />
      <Route path={"/thank-you"} component={ThankYou} />
      <Route path={"/manifesto"} component={Manifesto} />
      <Route path={"/whitepaper"} component={Whitepaper} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
