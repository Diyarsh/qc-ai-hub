import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">QazCloud AI-HUB</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t('footer.products')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.products.studio')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.products.projects')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.products.history')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.products.lab')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.company.about')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.company.contact')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.company.docs')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.company.support')}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
