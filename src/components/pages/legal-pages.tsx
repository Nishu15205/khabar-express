import { Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import { PageShell, ProseSection, P, UL } from "@/components/pages/page-shell";
import { ContactFormClient } from "@/components/pages/contact-form-client";

/** ⚠️ अपना असली ईमेल यहाँ डालें — AdSense reviewer इसे देखता है। */
export const SITE_EMAIL = "contact@khabarexpress.in";

const UPDATED = "15 सितंबर 2026";

/* ------------------------------ PRIVACY ------------------------------ */

export function PrivacyPage() {
  return (
    <PageShell
      title="गोपनीयता नीति (Privacy Policy)"
      subtitle="आपकी निजता हमारे लिए उतनी ही महत्वपूर्ण है जितनी ताज़ा खबरें।"
      updated={UPDATED}
    >
      <ProseSection>
        <P>
          खबर एक्सप्रेस (&quot;हम&quot;, &quot;हमारी वेबसाइट&quot;) पर आने के लिए धन्यवाद। यह
          गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट का उपयोग करते हैं तो कौन-सी
          जानकारी एकत्र होती है, उसका उपयोग कैसे होता है, और आपके अधिकार क्या हैं।
        </P>
      </ProseSection>

      <ProseSection heading="1. हम कौन-सी जानकारी एकत्र करते हैं?">
        <UL
          items={[
            <>
              <strong>स्वचालित रूप से:</strong> ब्राउज़र का प्रकार, डिवाइस, लगभग
              स्थान (शहर/देश स्तर), देखे गए पृष्ठ और विज़िट का समय — यह सामान्य
              एनालिटिक्स जानकारी होती है जो हर वेबसाइट पर एकत्र होती है।
            </>,
            <>
              <strong>आपसे सीधे:</strong> यदि आप संपर्क फॉर्म भरते हैं, तो आपका नाम,
              ईमेल और संदेश — सिर्फ आपकी शिकायत/सुझाव का जवाब देने के लिए।
            </>,
            <>
              <strong>कुकीज़ व विज्ञापन:</strong> Google और तीसरे पक्ष के विज्ञापन
              साझेदार बेहतर विज्ञापन अनुभव के लिए कुकीज़ का उपयोग कर सकते हैं
              (नीचे विस्तार से)।
            </>,
          ]}
        />
      </ProseSection>

      <ProseSection heading="2. कुकीज़ और Google AdSense">
        <P>
          तीसरे पक्ष के विज्ञापन प्रदाता, जिनमें Google शामिल है, आपकी पूर्व
          विज़िटों के आधार पर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करते हैं।
          Google का DART कुकी इस्तेमाल करके उपयोगकर्ताओं को उनकी पिछली विज़िटों
          के आधार पर विज्ञापन दिखाए जा सकते हैं।
        </P>
        <P>
          आप <strong>Google Ads Settings</strong> (adssettings.google.com) से
          वैयक्तिकृत विज्ञापन बंद कर सकते हैं, और अपने ब्राउज़र की सेटिंग्स से
          कुकीज़ प्रबंधित या हटा सकते हैं। कुकीज़ बंद करने पर वेबसाइट का उपयोग
          करने में कोई बाधा नहीं आती।
        </P>
      </ProseSection>

      <ProseSection heading="3. जानकारी का उपयोग कैसे होता है?">
        <UL
          items={[
            "वेबसाइट के कंटेंट और अनुभव को बेहतर बनाने के लिए।",
            "आपके संपर्क संदेशों का जवाब देने के लिए।",
            "साइट की सुरक्षा और दुरुपयोग रोकने के लिए।",
            "विज्ञापन प्रदर्शित करने के लिए (जो इस मुफ़्त सेवा को चलाते हैं)।",
          ]}
        />
        <P>
          हम आपकी व्यक्तिगत जानकारी <strong>बेचते नहीं</strong> हैं।
        </P>
      </ProseSection>

      <ProseSection heading="4. बाहरी लिंक और स्रोत">
        <P>
          हमारी साइट प्रतिष्ठित समाचार स्रोतों की सार्वजनिक RSS फ़ीड से शीर्षक व
          संक्षिप्त समाचार दिखाती है और हर खबर में मूल प्रकाशक के पूरे लेख का
          लिंक देती है। उन बाहरी वेबसाइटों की गोपनीयता प्रथाओं के लिए हम
          ज़िम्मेदार नहीं हैं — वहाँ उनकी अपनी नीति लागू होती है।
        </P>
      </ProseSection>

      <ProseSection heading="5. बच्चों की निजता">
        <P>
          हमारी साइट 13 वर्ष से कम उम्र के बच्चों से जानबूझकर कोई व्यक्तिगत
          जानकारी एकत्र नहीं करती। यदि आपको ऐसा लगे तो हमें सूचित करें — हम तुरंत
          उसे हटा देंगे।
        </P>
      </ProseSection>

      <ProseSection heading="6. आपके अधिकार">
        <P>
          आप अपनी व्यक्तिगत जानकारी देखने, सुधारने या हटवाने का अनुरोध कर सकते
          हैं। ऐसे किसी भी अनुरोध के लिए{" "}
          <a
            className="text-primary underline underline-offset-2"
            href={`mailto:${SITE_EMAIL}`}
          >
            {SITE_EMAIL}
          </a>{" "}
          पर लिखें — हम 48 घंटों में जवाब देने की कोशिश करते हैं।
        </P>
      </ProseSection>

      <ProseSection heading="7. नीति में बदलाव">
        <P>
          यह नीति समय-समय पर अपडेट हो सकती है। बदलाव इसी पृष्ठ पर प्रकाशित होंगे
          और तारीख अपडेट कर दी जाएगी। नियमित उपयोग से आप अपडेटेड नीति से सहमत
          माने जाएंगे।
        </P>
      </ProseSection>
    </PageShell>
  );
}

/* ------------------------------- ABOUT ------------------------------- */

export function AboutPage() {
  return (
    <PageShell
      title="हमारे बारे में (About Us)"
      subtitle="ताज़ा हिंदी खबरें — हर पल, सबसे तेज़, सबसे साफ़-सुथरे तरीके से।"
      updated={UPDATED}
    >
      <ProseSection>
        <P>
          <strong>खबर एक्सप्रेस</strong> एक स्वतंत्र हिंदी न्यूज़ पोर्टल है जिसका
          मकसद सीधा है — भारत और दुनिया की ताज़ा खबरें एक ही जगह, बिना भ्रम
          और बिना क्लिक-बेट के पढ़ने की सुविधा देना। हम देश, दुनिया, खेल,
          बिज़नेस, मनोरंजन और टेक्नोलॉजी की खबरों को श्रेणी-वार व्यवस्थित करके
          पेश करते हैं।
        </P>
      </ProseSection>

      <ProseSection heading="हम कैसे काम करते हैं?">
        <P>
          हमारी साइट प्रतिष्ठित समाचार प्रकाशकों (जैसे TV9 हिंदी, BBC हिंदी, पंजाब
          केसरी) की <strong>सार्वजनिक RSS फ़ीड</strong> के माध्यम से शीर्षक और
          संक्षिप्त समाचार एकत्रित करती है। हर खबर के साथ{" "}
          <strong>मूल स्रोत का साफ़ लिंक</strong> दिया जाता है ताकि पाठक पूरी
          खबर सीधे प्रकाशक की साइट पर पढ़ सकें। हम किसी प्रकाशक की सामग्री को
          अपने नाम से प्रकाशित नहीं करते — सभी अधिकार संबंधित प्रकाशकों के पास
          हैं।
        </P>
        <P>
          इसके अलावा खबर एक्सप्रेस टीम <strong>मौलिक (original) लेख</strong> भी
          लिखती है — समझाऊ-शिक्षाप्रद पीस जो रोज़ की खबरों की पृष्ठभूमि को आसान
          भाषा में समझाते हैं (जैसे UPI सुरक्षा, मौसम भविष्यवाणी कैसे होती है,
          बजट कैसे बनाएं)। ये लेख हमारी अपनी शोध और भाषा में लिखे जाते हैं।
        </P>
      </ProseSection>

      <ProseSection heading="हमारा संपादकीय मानक">
        <UL
          items={[
            "हर एग्रीगेटेड खबर में स्रोत का नाम और लिंक — पारदर्शिता सबसे पहले।",
            "कोई भ्रामक, घृणित या अश्लील सामग्री नहीं — परिवार-मैत्री पोर्टल।",
            "लेखों में तथ्यों को सरल भाषा में, बिना सनसनी के प्रस्तुत करना।",
            "पाठकों की शिकायतें गंभीरता से — 48 घंटों में जवाब की कोशिश।",
          ]}
        />
      </ProseSection>

      <ProseSection heading="टीम और संपर्क">
        <P>
          खबर एक्सप्रेस एक छोटी, समर्पित टीम चलाती है — संपादक, लेखक और तकनीकी
          विकासक। किसी भी खबर, सुधार या साझेदारी के लिए आप हमें{" "}
          <a
            className="text-primary underline underline-offset-2"
            href={`mailto:${SITE_EMAIL}`}
          >
            {SITE_EMAIL}
          </a>{" "}
          पर लिख सकते हैं या{" "}
          <a
            className="text-primary underline underline-offset-2"
            href="/?page=contact"
          >
            संपर्क पृष्ठ
          </a>{" "}
          का फॉर्म उपयोग कर सकते हैं।
        </P>
      </ProseSection>

      <ProseSection heading="भविष्य की दिशा">
        <P>
          हम आगे ज़िला-स्तर की खबरें, पाठकों की सबमिट की गई कहानियां और वीडियो
          सम्मेलन जोड़ने पर काम कर रहे हैं। आपके सुझाव हमारी राह का नक्शा हैं —
          बेझिझक लिखें।
        </P>
      </ProseSection>
    </PageShell>
  );
}

/* ------------------------------ CONTACT ------------------------------ */

export function ContactPage() {
  return (
    <PageShell
      title="संपर्क करें (Contact Us)"
      subtitle="सुझाव, शिकायत, सुधार-अनुरोध या साझेदारी — हमसे जुड़ें।"
      updated={UPDATED}
    >
      <ProseSection>
        <P>
          पाठकों की आवाज़ हमारे लिए सबसे कीमती है। अगर किसी खबर में त्रुटि दिखी
          हो, कोई सुझाव हो, कॉपीराइट संबंधी चिंता हो या बस नमस्ते कहना हो — नीचे
          दिए तरीकों से हमसे संपर्क करें। हम आमतौर पर <strong>24-48 घंटों</strong>{" "}
          में जवाब देते हैं।
        </P>
      </ProseSection>

      <ProseSection heading="सीधा संपर्क">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">ईमेल</p>
              <a
                className="text-sm text-muted-foreground underline underline-offset-2"
                href={`mailto:${SITE_EMAIL}`}
              >
                {SITE_EMAIL}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">जवाब का समय</p>
              <p className="text-sm text-muted-foreground">24-48 घंटे (कार्यदिवसों में)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">स्थान</p>
              <p className="text-sm text-muted-foreground">भारत (ऑनलाइन पोर्टल)</p>
            </div>
          </div>
        </div>
      </ProseSection>

      <ProseSection heading="संदेश भेजें">
        <ContactFormClient email={SITE_EMAIL} />
      </ProseSection>

      <ProseSection heading="कॉपीराइट / DMCA">
        <P>
          यदि आप किसी सामग्री के अधिकारी हैं और मानते हैं कि हमारी साइट पर आपके
          कॉपीराइट का उल्लंघन हुआ है, तो ईमेल पर सामग्री का लिंक और अपने
          अधिकार का प्रमाण भेजें। हम सत्यापन के बाद <strong>48 घंटों के भीतर</strong>{" "}
          सामग्री हटाने की प्रक्रिया पूरी करते हैं।
        </P>
        <p className="flex items-start gap-2 rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          हमारी साइट एग्रीगेटर है — हर खबर में मूल स्रोत का लिंक पहले से मौजूद
          रहता है और हम अधिकार-धारकों के साथ तुरंत सहयोग करते हैं।
        </p>
      </ProseSection>
    </PageShell>
  );
}
