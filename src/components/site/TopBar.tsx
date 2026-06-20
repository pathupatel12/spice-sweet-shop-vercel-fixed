export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground text-xs">
      <div className="container mx-auto flex items-center justify-center gap-6 px-4 py-2 text-center">
        <span>🌿 Free shipping on orders above ₹499</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Cash on Delivery available</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">100% Natural · No Preservatives</span>
      </div>
    </div>
  );
}