import React from 'react';
import { getDictionary } from '../../dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');
  return { title: dict.privacy.title };
}

export default async function PrivacyPolicy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-300 py-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto bg-[#121622] p-8 md:p-12 rounded-2xl border border-gray-800 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">{dict.privacy.title}</h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p>
            This Privacy Policy describes the data that we process to support Vidplus apps, websites, and related services offered by Vidplus (Vidplus). You can find additional tools and data in the Vidplus settings. It explains our practices concerning the personal data we collect from you, or that you provide to us, in connection with Vidplus. If you do not agree with this policy, you should not use Vidplus.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. Data Collection</h2>
          <p>
            The type of data that we collect and process is dependent on how you use Vidplus. For instance, the data we collect from the reader on Vidplus is not the same as that from the author who publishes the novel on Vidplus. Even if you don't have an account, if you use Vidplus, we'll be able to collect some data about you.
          </p>
          <p>The data we collect and process as follows:</p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">I. Your Operation and Data you provide</h3>
          <p>
            On Vidplus, you can read or publish novels, make comments, and purchase coins for charged chapters and so on. We will collect the operation that you may perform on Vidplus and the data you provide, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>the content you create, for example novel or comments;</li>
            <li>the metadata about the content itself, for example upload address or creation documents date, in accordance with the relevant legislation;</li>
            <li>the type of content that you read or comment;</li>
            <li>the application and function you use, and your operation during this;</li>
            <li>the purchase or other transactions you do including the credit card data;</li>
            <li>the time, frequency, and duration of your operation.</li>
          </ul>

          <h4 className="text-lg font-semibold text-white mt-4 mb-2">Data under special protection</h4>
          <p>
            You can choose to provide data about your age, gender, address, and email address. These and some other types of data may be specially protected under the laws of your jurisdiction.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">II. Application, Browser and Device Data</h3>
          <p>
            We will collect and receive data about the different devices you use and how you use these devices, and the data that comes from these devices.
          </p>
          <p>The device data that we collect and receive including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>the device and software that you currently use, and other device characteristics;</li>
            <li>the data that your device links to the Internet, including your IP address;</li>
            <li>the data that is collected by Cookie (specified on Section 2) and other similar techniques.</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">III. Data that comes from Business Partner, Supplier and Third Party</h3>
          <p>
            We will collect various data and operations that you are on or out of Vidplus from business partner, supplier and third party. For example, we will collect your device data, your using application and the advertisement you view. Furthermore, a business partner will share us some other data, such as your email, third-party account data.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. Cookie</h2>
          <p>
            Cookies are small pieces of text used to store data on web browsers. Cookies are used to store and receive identifiers and other data on computers, phones and other devices. Other technologies, including data that we store on your web browser or device, identifiers associated with your device and other software, are used for similar purposes. In this policy, we refer to all of these technologies as "cookies".
          </p>
          <p>
            We use cookies if you have a Vidplus account, use Vidplus, including our website and apps, or visit other websites and apps that use Vidplus. Cookies enable Vidplus to offer Vidplus to you and to understand the data that we receive about you, including data about your use of other websites and apps, whether you are registered or logged in or not.
          </p>
          <p>We use cookies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Verify log-in data.</li>
            <li>Track traffic flow and patterns of travel in connection with the Services.</li>
            <li>Understand the total number of visitors to the Services on an ongoing basis and the types of devices.</li>
            <li>Monitor the performance of the Services and continually improve it.</li>
            <li>Customize and enhance your online experience.</li>
            <li>Provide customer service.</li>
          </ul>
          <p>
            You have the right to choose whether to accept cookies or not. However, please note that if you choose to refuse cookies. Certain parts of Vidplus may not work properly if you have disabled browser cookie use. Please be aware that these controls are distinct from the controls that Vidplus offers you.
          </p>
          <p>
            Most devices (in the case of mobile applications) and browsers (in the case of web apps and pages) are initially set up to accept cookies and allow you to change your cookie settings. These settings will typically be found in your browser’s “options” or “preferences” menu. You can reset your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. The Ways and Purpose of Data Processing</h2>
          <p>
            The types of data we process and the purposes and ways we process it are as follows:
          </p>
          <p>
            <strong>Providing Vidplus</strong> involves collecting, storing, sharing, analyzing, reviewing, and collating data when necessary, and in some cases using not only automated processing techniques but also a manual review process to accomplish the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating and maintaining your account and personal homepage;</li>
            <li>Promoting content presenting;</li>
            <li>Providing the comments function;</li>
            <li>Offering the commercial novels; and</li>
            <li>Carrying out an analysis.</li>
          </ul>
          <p>
            We also use the available data to develop, study, and test Vidplus improvement. The data we have is used for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Knowing if Vidplus is working properly;</li>
            <li>Solving issues and correcting exceptions;</li>
            <li>Testing New Features;</li>
            <li>Acquiring feedback for Vidplus or functions.</li>
          </ul>

          <p>
            We will process your relative data we control and use an automated processing technique, in some cases take a manual review process to accomplish the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Verifying accounts and operations;</li>
            <li>Investigating suspicious activity;</li>
            <li>Anti-piracy operation;</li>
            <li>Detecting, preventing and combating harmful or illegal activities;</li>
            <li>Monitoring and preventing spam, as well as other security issues and bad experiences.</li>
          </ul>

          <p>
            <strong>Transfer, store, or process your data across borders</strong>, including with the United States and other countries. Because Vidplus operates on a global scale, with our users, partners, suppliers and employees all over the world, it is necessary for us to communicate data for the purpose of maintaining, analysis and improvement of Vidplus.
          </p>

          <p>
            <strong>Share your contact details, personal data, or other data with a third party.</strong> The type of data you want to share will be different according to what you require us to share. For example: When you instruct us to pay your proceeds by PayPal, we will share your PayPal account data or other data you may allow in order to be able to pay successfully.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">4. Data Sharing</h2>
          <p>
            We will never sell any of your data to anyone, and we require partners and third parties to follow the rules that define how they are allowed and prohibited from using and disclosing the data we provide.
          </p>
          <p>Specifically, we share data with the following third parties:</p>
          <ul className="list-none space-y-3">
            <li>(a) We work with third-party partners who help us improve Vidplus, which makes it possible to operate our companies and provide services to people around the world.</li>
            <li>(b) We do not provide any personally identifiable data</li>
            <li>(c) to these third-party ad servers or ad networks without your consent or except as part of a specific program or feature for which you will have the ability to opt-in or opt-out.</li>
            <li>(d) Members, subsidiaries, or affiliates of our corporate group, make Vidplus improving and optimizing.</li>
            <li>(e) Law enforcement agencies, public or tax authorities or other organizations if legally required to do so.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">5. Data Security</h2>
          <p>
            We take reasonable and appropriate technical and organizational measures to help protect personal data from unauthorized access, use, disclosure, alteration, and destruction. Unfortunately, the transmission of data via the internet is not completely secure and we cannot guarantee the security of your data transmitted via the Platform; any transmission is at your own risk. To help us protect personal data, we request that you use a strong password and never share your password with anyone or use the same password with other sites or accounts.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">6. Data Management or Deleting and Your Rights Exercising</h2>
          <p>
            We provide the following tools for viewing, managing, downloading, and deleting your own personal data. You can also visit the Settings page of the product you are using to manage personal data. In addition, you may have other privacy rights under applicable law.
          </p>
          <p>
            You can use Personal Center, or open the client, click "My" - "Contact Customer Service", and then contact the customer service by email hai@vidplus.web.id to exercise your rights.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">I. View and manage your personal data</h3>
          <p>
            You are entitled to access, view and manage your personal data via Personal Center, or open the client, click "My" - "Contact Customer Service", and then contact the customer service by email hai@vidplus.web.id.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">II. Delete your personal data or your account</h3>
          <p>If you want to remove your personal data, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Search for and remove certain personal data</strong>
              <br />
              We have provided you with a series of tools that will help you delete certain personal data. For example, you can use the Delete button to remove books from the shelf. You can remove the comments by clicking the Delete button. Once the comments are removed, other users will not be able to see them anymore.
            </li>
            <li>
              <strong>Remove your account permanently</strong>
              <br />
              You can contact us by e-mail at hai@vidplus.web.id to ask for your account to be removed.
            </li>
          </ul>
          <p>
            Once your account is removed, we will no longer supply you with any products or services. We will remove your personal data at your request, except as otherwise required by the law.
          </p>
          <p>
            We will help you to remove your account data and delete your payment records for unlock chapters. If you permanently remove your account, you cannot reactivate it, and you cannot retrieve your reading, spending, or unlocking records, including the balance of your top-up voucher.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">III. How long does it take to delete your personal data?</h3>
          <p>
            The time required for deletion varies; for example, deleting your personal data is instantaneous and will be removed immediately. Deleting the account must not last more than 15 days from the date of receipt of the request. If you do not like it, please contact the customer service department and complain.
          </p>
          <p>
            You can use Personal Center to view your personal data or click "My" - "Contact Customer Service". You can inquire, correct, delete, cancel user account, and revoke authorized user's operation by contacting client. For safety reasons, you might want to submit a written request. Or some other way to prove your identity. You may be required to confirm your identity before you proceed with your application.
          </p>
          <p>
            A reply will be sent to you within 15 working days. If you don't like it, feel free to contact customer service to complain.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">7. Age Restrictions</h2>
          <p>
            Vidplus is not developed for children. This Platform is not directed at children under the age of 12 or equivalent minimum age in the relevant jurisdiction. If you believe that we have personal data about or collected from a child under the relevant age, please contact us at hai@vidplus.web.id.
          </p>
          <p>
            Users between 12 and 18 (each a “Teen”) may not access or use the Service unless (i) both the Teen and their parent or legal guardian have first agreed to these Terms of Service; and (ii) the Teen uses an account established by their parent or legal guardian, under such parent or guardian’s supervision, and with such parent or guardian’s permission. If you permit a Teen to use the Services, you hereby agree to these Terms of Service on behalf of both yourself and the Teen. You further agree that you are solely responsible for any and all use of the Service by your Teen regardless of whether such use was authorized by you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">8. Data Retention Time</h2>
          <p>
            We retain your data for as long as it is necessary to provide you with the service or fulfill the transactions you have requested or authorized. Where we do not need your data in order to provide the service to you, we retain it only for so long as we have a legitimate business purpose in keeping such data, including to comply with our legal obligations, enforce our agreements, resolve disputes, and as necessary for the establishment, exercise or defense of legal claims.
          </p>
          <p>
            You can delete your Account, and you should understand that upon deletion of your Account, you will lose the right to access or use all or part of the Platform. After you have deleted your account, we may retain certain data in an aggregated and anonymized format.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">9. Changes of this policy</h2>
          <p>
            We'll notify you before we make changes to this policy and give you the opportunity to review the revised policy before you choose to continue using our Products.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">10. Complaints</h2>
          <p>
            In the event that you wish to make a complaint about how we process your personal data, please submit your complaint via email at hai@vidplus.web.id. We will endeavor to deal with your request as soon as possible. This is without prejudice to your right to launch a claim with your data protection authority or follow the dispute resolution process provided in the Terms of Service.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">11. Contact</h2>
          <p>If you have questions about this policy, you can contact us as described below.</p>
          <div className="bg-[#07090e] p-6 rounded-xl border border-gray-800 mt-6">
            <h3 className="font-bold text-white mb-2">Contact Us</h3>
            <p>You can contact us by email or by mail at:</p>
            <p className="mt-2 text-[#ffbd59]">
              <a href="mailto:hai@vidplus.web.id">hai@vidplus.web.id</a>
            </p>
            <p className="mt-4 text-gray-400">
              Vidplus, Privacy Office,<br />
              112 ROBINSON ROAD #03-01 ROBINSON 112 SINGAPORE (068902)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
