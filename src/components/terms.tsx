import License from "./licenseAgreement"

export default function Terms(){

return(
    <div id="terms" className="text-base text-justify px-4 h-[60dvh] overflow-auto items-center">
<h1 className="text-center">Arp Radio Terms of Use</h1>

<p>Welcome to Arp Radio, a service by The Psyence Lab LLC (&quot;Arp Radio&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our website and services, including minting music tokens, you agree to be bound by these Terms of Use (the &quot;Terms&quot;) and our Privacy Policy. If you do not agree to these Terms, please do not use our service.</p>

<h2>1. Age Restriction</h2>
<p>The Arp Radio service is not intended for children under the age of 18. By using our service, you represent and warrant that you are at least 18 years old. If you are under the age of 18, please do not use our service.</p>

<h2>2. User Content</h2>
<p>Users may mint music tokens (&quot;User Content&quot;) through the Arp Radio service. By minting a token, you agree to the terms of the Royalty Free License Agreement below.</p>
<License/>
<h2>3. Disclaimer</h2>
<p>Arp Radio does not endorse, support, or otherwise promote any opinions, messages, or content provided by users through the music tokens. User Content does not necessarily reflect the views of Arp Radio or its affiliates.</p>

<h2>4. Prohibited Content</h2>
<p>Users shall not mint tokens containing any of the following:</p>
<ol type="1">
  <li>Content that infringes upon the intellectual property rights of others;</li>
  <li>Hateful, discriminatory, or harassing content;</li>
  <li>Pornographic or sexually explicit content;</li>
  <li>Violent or graphically disturbing content;</li>
  <li>Content promoting illegal activities;</li>
  <li>Any other content that violates applicable laws or regulations.</li>
</ol>
<p>Arp Radio reserves the right to remove any User Content that violates these Terms without prior notice.</p>

<h2>5. Intellectual Property</h2>
<p>All content on the Arp Radio website, excluding User Content, is the property of The Psyence Lab LLC and is protected by copyright, trademark, and other intellectual property laws.</p>

<h2>6. Limitation of Liability</h2>
<p>In no event shall Arp Radio be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or relating to the use of our service.</p>

<h2>7. Indemnification</h2>
<p>You agree to indemnify, defend, and hold harmless Arp Radio and its affiliates, officers, directors, employees, and agents from and against any claims, damages, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of your use of our service or your violation of these Terms.</p>

<h2>8. Modification of Terms</h2>
<p>Arp Radio reserves the right to modify these Terms at any time. Your continued use of our service after any such changes constitutes your acceptance of the new Terms.</p>

<p>By using the Arp Radio service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.</p>
    </div>
)
}