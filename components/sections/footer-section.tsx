export default function FooterSection() {
  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm text-muted-foreground">
          Open Market Research © 2025
          <br />
          Built in public · Open-source on GitHub · Free forever
          <br />
          <a
            href="mailto:hello@fbien.com"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            hello@fbien.com
          </a>
        </p>
      </div>
    </footer>
  );
}
