"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type InfoKey = "about" | "privacy" | "terms" | "copyright" | "contact" | null;

/** ⚠️ Yahan apna real email daalein — DMCA/privacy notices is par aayenge. */
export const SITE_EMAIL = "contact@khabarexpress.in";
export const SITE_NAME = "खबर एक्सप्रेस";

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="font-headline text-base font-bold text-foreground">{heading}</h3>
      <div className="space-y-2 text-sm leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}

const CONTENT: Record<
  Exclude<InfoKey, null>,
  { title: string; description: string; body: React.ReactNode }
> = {
  about: {
    title: "हमारे बारे में",
    description: `${SITE_NAME} — देश-दुनिया की हर खबर, सबसे तेज़`,
    body: (
      <>
        <p>
          {SITE_NAME} एक स्वचालित <strong>समाचार एग्रीगेटर</strong> (news aggregator)
          है। हम भारत के प्रतिष्ठित हिंदी समाचार प्रकाशकों — जैसे TV9 हिंदी, BBC हिंदी,
          पंजाब केसरी — की <strong>सार्वजनिक RSS फ़ीड</strong> के माध्यम से शीर्षक और
          संक्षिप्त जानकारी एकत्रित करते हैं।
        </p>
        <Section heading="हम क्या करते हैं">
          <ul className="list-disc space-y-1 pl-5">
            <li>हर खबर के साथ <strong>स्रोत का नाम</strong> स्पष्ट रूप से दिखाते हैं</li>
            <li>हर खबर में <strong>मूल लेख का सीधा लिंक</strong> देते हैं</li>
            <li>केवल शीर्षक और अल्प सारांश दिखाते हैं — पूरा लेख कभी पुनःप्रकाशित नहीं करते</li>
            <li>समाचार चित्र AI-जनित हमारी अपनी संपत्ति हैं</li>
          </ul>
        </Section>
        <Section heading="हमारा उद्देश्य">
          <p>
            पाठकों को एक ही जगह ताज़ा हिंदी खबरों का पूर्वावलोकन देना और मूल प्रकाशकों
            की वेबसाइट पर पाठक पहुँचाना। हम किसी प्रकाशक के विज्ञापन राजस्व या ट्रैफिक
            को हानि नहीं पहुँचाना चाहते — इसके विपरीत, हमारे माध्यम से उन्हें अतिरिक्त
            पाठक मिलते हैं।
          </p>
        </Section>
      </>
    ),
  },

  privacy: {
    title: "गोपनीयता नीति (Privacy Policy)",
    description: "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है",
    body: (
      <>
        <p>
          यह गोपनीयता नीति बताती है कि {SITE_NAME} आपकी जानकारी को कैसे संभालता है।
        </p>
        <Section heading="जानकारी जो हम एकत्र करते हैं">
          <ul className="list-disc space-y-1 pl-5">
            <li>हम कोई व्यक्तिगत जानकारी (नाम, ईमेल, फोन) <strong>नहीं माँगते</strong> और न ही संग्रहित करते हैं</li>
            <li>खबरें पढ़ने के लिए लॉगिन/रजिस्ट्रेशन आवश्यक नहीं है</li>
            <li>लोकप्रिय खबरें दिखाने के लिए केवल <strong>गुमनाम (anonymous)</strong> पढ़ने की गिनती रखी जाती है</li>
          </ul>
        </Section>
        <Section heading="कुकीज़ और विज्ञापन (Google AdSense)">
          <p>
            यह साइट विज्ञापनों के लिए Google AdSense का उपयोग करती है। Google, तीसरे
            पक्ष के विक्रेता के रूप में, आपकी पिछली वेबसाइट विज़िट के आधार पर विज्ञापन
            दिखाने हेतु कुकीज़ का उपयोग करता है।
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Google DART कुकी का उपयोग करके उपयोगकर्ता को उनकी रुचि के अनुसार विज्ञापन दिखा सकता है</li>
            <li>उपयोगकर्ता <a className="text-primary underline underline-offset-2" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> पर जाकर व्यक्तिगत विज्ञापन बंद कर सकते हैं</li>
            <li>अधिक जानकारी के लिए देखें: <a className="text-primary underline underline-offset-2" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google की विज्ञापन नीति</a></li>
          </ul>
        </Section>
        <Section heading="बच्चों की गोपनीयता">
          <p>हम जानबूझकर 13 वर्ष से कम आयु के बच्चों की कोई जानकारी एकत्र नहीं करते।</p>
        </Section>
        <Section heading="संपर्क">
          <p>
            गोपनीयता से जुड़े किसी भी प्रश्न के लिए ईमेल करें:{" "}
            <a className="text-primary underline underline-offset-2" href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
          </p>
        </Section>
      </>
    ),
  },

  terms: {
    title: "उपयोग की शर्तें (Terms & Conditions)",
    description: "इस वेबसाइट का उपयोग करने की शर्तें",
    body: (
      <>
        <Section heading="सामग्री के अधिकार">
          <p>
            इस वेबसाइट पर दिखाई गई समाचार सामग्री (शीर्षक, सारांश) के सभी अधिकार
            संबंधित प्रकाशकों (TV9 हिंदी, BBC हिंदी, पंजाब केसरी आदि) के पास सुरक्षित
            हैं। {SITE_NAME} केवल एक पूर्वावलोकन (preview) मंच है और सामग्री का
            स्वामी नहीं है। पूर्ण लेख के लिए हमेशा मूल स्रोत से लिंक दिया जाता है।
          </p>
        </Section>
        <Section heading="सटीकता का दायित्व नहीं">
          <p>
            समाचार स्वचालित रूप से तीसरे पक्ष की फ़ीड से एकत्रित होते हैं। सामग्री
            &ldquo;जैसी है&rdquo; (as is) उपलब्ध कराई जाती है — सटीकता, पूर्णता या उपलब्धता
            की कोई गारंटी नहीं। किसी निर्णय से पहले मूल स्रोत अवश्य पढ़ें।
          </p>
        </Section>
        <Section heading="बाहरी लिंक और विज्ञापन">
          <p>
            बाहरी वेबसाइटों और विज्ञापनों (Google AdSense) की सामग्री के लिए हम
            ज़िम्मेदार नहीं हैं। विज्ञापन पर क्लिक करने का निर्णय पूर्णतः उपयोगकर्ता
            का होता है।
          </p>
        </Section>
        <Section heading="उपयोग की सीमा">
          <p>
            इस साइट को कानूनी उद्देश्य के लिए ही उपयोग करें। साइट की सामग्री को
            स्वचालित तरीकों (scraping/bots) से बड़ी मात्रा में कॉपी करना वर्जित है।
          </p>
        </Section>
      </>
    ),
  },

  copyright: {
    title: "कॉपीराइट व DMCA नीति",
    description: "बौद्धिक संपदा अधिकारों का सम्मान",
    body: (
      <>
        <p>
          {SITE_NAME} बौद्धिक संपदा अधिकारों का पूर्ण सम्मान करता है और कॉपीराइट
          कानूनों (भारतीय कॉपीराइट अधिनियम, 1957 — DMCA सहित) का पालन करता है।
        </p>
        <Section heading="हमारा दृष्टिकोण">
          <ul className="list-disc space-y-1 pl-5">
            <li>हम केवल <strong>सार्वजनिक RSS फ़ीड</strong> से शीर्षक और अल्प सारांश प्रदर्शित करते हैं</li>
            <li>हर खबर पर स्रोत प्रकाशक का नाम और मूल लेख का लिंक अनिवार्य रूप से दिया जाता है</li>
            <li>हम किसी प्रकाशक के चित्र/फ़ोटो हॉटलिंक या पुनःप्रकाशित नहीं करते</li>
            <li>समाचार चित्र AI-जनित हमारी अपनी संपत्ति हैं</li>
          </ul>
        </Section>
        <Section heading="शिकायत / Takedown कैसे करें">
          <p>
            यदि आप किसी सामग्री के स्वामी हैं और मानते हैं कि इस साइट पर आपके अधिकारों
            का उल्लंघन हुआ है, तो हमें ईमेल करें:{" "}
            <a className="text-primary underline underline-offset-2" href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>आपका नाम और संपर्क विवरण</li>
            <li>प्रभावित सामग्री का URL और विवरण</li>
            <li>यह बयान कि आप अधिकार के स्वामी हैं या अधिकृत प्रतिनिधि हैं</li>
          </ul>
          <p>
            <strong>वैध शिकायत मिलने पर 48 घंटे के भीतर</strong> संबंधित सामग्री हटा
            दी जाएगी। चाहें तो किसी प्रकाशक की फ़ीड को पूरी तरह हटाया भी जा सकता है।
          </p>
        </Section>
      </>
    ),
  },

  contact: {
    title: "संपर्क करें",
    description: "हमसे जुड़ें",
    body: (
      <>
        <p>किसी भी प्रश्न, सुझाव, विज्ञापन संबंधी जानकारी या शिकायत के लिए हमसे संपर्क करें:</p>
        <Section heading="ईमेल">
          <p>
            <a className="text-primary underline underline-offset-2" href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
          </p>
        </Section>
        <Section heading="जवाब का समय">
          <p>सामान्य प्रश्नों पर 2–3 कार्यदिवसों में; कॉपीराइट शिकायतों पर 48 घंटे के भीतर।</p>
        </Section>
        <p className="rounded-lg bg-muted/60 p-3 text-xs leading-6">
          नोट: यह ईमेल पता उदाहरण है — वेबसाइट चलाने से पहले इसे अपने वास्तविक ईमेल से
          बदल लें (src/components/news/info-modal.tsx में SITE_EMAIL)।
        </p>
      </>
    ),
  },
};

export function InfoModal({
  openKey,
  onOpenChange,
}: {
  openKey: InfoKey;
  onOpenChange: (key: InfoKey) => void;
}) {
  const content = openKey ? CONTENT[openKey] : null;

  return (
    <Dialog open={!!content} onOpenChange={(open) => !open && onOpenChange(null)}>
      <DialogContent className="max-h-[85vh] overflow-y-auto scrollbar-slim sm:max-w-2xl">
        {content && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-xl">{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pb-2">{content.body}</div>
            <p className="border-t pt-3 text-xs text-muted-foreground" suppressHydrationWarning>
              अंतिम अद्यतन: {new Date().getFullYear()}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
