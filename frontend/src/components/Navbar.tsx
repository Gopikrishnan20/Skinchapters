import { Link } from "react-router-dom";
import { ScanFace, Menu, User, Home, BarChart3 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading font-bold text-xl"
          >
            <ScanFace className="h-6 w-6 text-skin-purple" />
            <span>Skin Chapters</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <Link
            to="/"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/scan"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Scan
          </Link>
          <Link
            to="/chapters"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Chapters
          </Link>

          {/* Show only if logged in */}
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="ml-2"
              >
                Logout
              </Button>
            </>
          )}

          {/* Show login button if not logged in */}
          {!user && (
            <Link to="/signin">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 py-6">
              <Link
                to="/"
                className={cn("flex items-center gap-2 text-lg font-semibold")}
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link
                to="/scan"
                className={cn("flex items-center gap-2 text-lg font-semibold")}
                onClick={() => setIsOpen(false)}
              >
                <ScanFace className="h-5 w-5" />
                Scan
              </Link>
              <Link
                to="/chapters"
                className={cn("flex items-center gap-2 text-lg font-semibold")}
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                Chapters
              </Link>

              {/* Show only if logged in */}
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex items-center gap-2 text-lg font-semibold"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={cn(
                      "flex items-center gap-2 text-lg font-semibold"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left flex items-center gap-2 text-lg font-semibold"
                  >
                    <User className="h-5 w-5" />
                    Logout
                  </button>
                </>
              )}

              {/* Show login if not logged in */}
              {!user && (
                <Link
                  to="/signin"
                  className={cn(
                    "flex items-center gap-2 text-lg font-semibold"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
