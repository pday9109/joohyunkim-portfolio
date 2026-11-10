import { IntroScreen } from "@/components/layout/IntroScreen";
import { getSiteConfig } from "@/lib/data/getSiteConfig";

export default async function HomePage() {
  const site = await getSiteConfig();

  return (
    <IntroScreen
      artistNameEn={site.artistNameEn}
      backgroundImage={site.mainBackgroundImage}
    />
  );
}
