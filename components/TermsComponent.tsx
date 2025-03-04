"use client"
import React, {useState}  from "react";
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";

const TermsOfUse = () => {
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
 

  
  return (
    <>
    <Toaster />
    <section className="pl-24 pr-24 pt-10">
    <h1 className="mb-4 mt-4 text-4xl max-2xl tracking-tight font-bold text-black ">
    Terms and Conditions
          </h1>

          <h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
          Agreement between user and PropertyListingsAI.com
          </h2>
          <p className="mb-5 mt-5  text-black sm:text-lg">
          
Welcome to PropertyListingsAI.com. The PropertyListingsAI.com website (the "Site") and the services it provides (the "Service") is comprised of various web pages, public API endpoints, and application integrations for third parties. The Site and the Service are operated by PropertyListingsAI LLC. PropertyListingsAI.com is offered to you conditioned on your acceptance without modification of the terms, conditions, and notices contained herein (the "Terms"). Your use of PropertyListingsAI.com constitutes your agreement to all such Terms. Please read these terms carefully, and keep a copy of them for your reference.

</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Electronic Communications
          </h2>

          <p className="mb-5 mt-5  text-black sm:text-lg">
Visiting PropertyListingsAI.com or sending emails to PropertyListingsAI LLC constitutes electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communications be in writing.
</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Your account
          </h2>

          <p className="mb-5 mt-5  text-black sm:text-lg">
If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity. You acknowledge that PropertyListingsAI LLC is not responsible for third party access to your account that results from theft or misappropriation of your account. PropertyListingsAI LLC and its associates reserve the right to refuse or cancel service, terminate accounts, or remove or edit content in our sole discretion.

PropertyListingsAI LLC does not knowingly collect, either online or offline, personal information from persons under the age of thirteen. If you are under 18, you may use PropertyListingsAI.com only with permission of a parent or guardian.

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">

Cancellation/Refund Policy
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
You can cancel your subscription at any time. You will be responsible for charges up to your cancellation date.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">

Referral Program
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
PropertyListingsAI LLC may offer you opportunities to earn a referral credit. The details of what how you might do so are explained on our Website. Any referral credits will be applied automatically to your account, and are not convertible into cash. If you cancel and/or delete your account without using your credits, they are forfeited.
</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Links to third party sites/Third party services
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
PropertyListingsAI.com may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of PropertyListingsAI LLC and PropertyListingsAI LLC is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. PropertyListingsAI LLC is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by PropertyListingsAI LLC of the site or any association with its operators.

Certain services made available via PropertyListingsAI.com are delivered by third party sites and organizations. By using any product, service or functionality originating from the PropertyListingsAI.com domain, you hereby acknowledge and consent that PropertyListingsAI LLC may share such information and data with any third party with whom PropertyListingsAI LLC has a contractual relationship to provide the requested product, service or functionality on behalf of PropertyListingsAI.com users and customers.
</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
No unlawful or prohibited use/Intellectual Property
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
You are granted a non-exclusive, non-transferable, revocable license to access and use PropertyListingsAI.com strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to PropertyListingsAI LLC that you will not use the Site for any purpose that is unlawful or prohibited by these Terms. You may not use the Site in any manner which could damage, disable, overburden, or impair the Site or interfere with any other party's use and enjoyment of the Site. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Site.

All content included as part of the Service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site, is the property of PropertyListingsAI LLC or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights. You agree to observe and abide by all copyright and other proprietary notices, legends or other restrictions contained in any such content and will not make any changes thereto.

You will not modify, publish, transmit, reverse engineer, participate in the transfer or sale, create derivative works, or in any way exploit any of the content, in whole or in part, found on the Site. PropertyListingsAI LLC content is not for resale. Your use of the Site does not entitle you to make any unauthorized use of any protected content, and in particular you will not delete or alter any proprietary rights or attribution notices in any content. You will use protected content solely for your personal use, and will make no other use of the content without the express written permission of PropertyListingsAI LLC and the copyright owner. You agree that you do not acquire any ownership rights in any protected content. We do not grant you any licenses, express or implied, to the intellectual property of PropertyListingsAI LLC or our licensors except as expressly authorized by these Terms.
</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Usage Restrictions
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
You may not use the Site to create, support, or work on software that executes securities transactions, makes medical diagnoses, or contains pornography.
You may not use the Site or our API as part of a real-time and/or on-the-fly system to serve alt text on a per-request basis. For example, calling our API every time a browser requests your web page is a violation of these Terms. Violating this restriction may result in your account being cancelled without a refund.

</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Use of communication services
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
The Site may contain chat areas, forums, and/or other message or communication facilities designed to enable you to communicate with a private group (collectively, "Communication Services"). You agree to use the Communication Services only to post, send and receive messages and material that are proper and related to the particular Communication Service.

By way of example, and not as a limitation, you agree that when using a Communication Service, you will not: defame, abuse, harass, stalk, threaten or otherwise violate the legal rights (such as rights of privacy and publicity) of others; publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topic, name, material or information; upload files that contain software or other material protected by intellectual property laws (or by rights of privacy of publicity) unless you own or control the rights thereto or have received all necessary consents; upload files that contain viruses, corrupted files, or any other similar software or programs that may damage the operation of another's computer; advertise or offer to sell or buy any goods or services for any business purpose, unless such Communication Service specifically allows such messages; conduct or forward surveys, contests, pyramid schemes or chain letters; download any file posted by another user of a Communication Service that you know, or reasonably should know, cannot be legally distributed in such manner; falsify or delete any author attributions, legal or other proper notices or proprietary designations or labels of the origin or source of software or other material contained in a file that is uploaded, restrict or inhibit any other user from using and enjoying the Communication Services; violate any code of conduct or other guidelines which may be applicable for any particular Communication Service; harvest or otherwise collect information about others, including e-mail addresses, without their consent; violate any applicable laws or regulations.

PropertyListingsAI LLC has no obligation to monitor the Communication Services. However, PropertyListingsAI LLC reserves the right to review materials posted to a Communication Service and to remove any materials in its sole discretion. PropertyListingsAI LLC reserves the right to terminate your access to any or all of the Communication Services at any time without notice for any reason whatsoever.

PropertyListingsAI LLC reserves the right at all times to disclose any information as necessary to satisfy any applicable law, regulation, legal process or governmental request, or to edit, refuse to post or to remove any information or materials, in whole or in part, in PropertyListingsAI LLC's sole discretion.

Always use caution when giving out any personally identifying information about yourself or your children in any Communication Service. PropertyListingsAI LLC does not control or endorse the content, messages or information found in any Communication Service and, therefore, PropertyListingsAI LLC specifically disclaims any liability with regard to the Communication Services and any actions resulting from your participation in any Communication Service. Managers and hosts are not authorized PropertyListingsAI LLC spokespersons, and their views do not necessarily reflect those of PropertyListingsAI LLC.

</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Use of Artificial Intelligence services and data
</h2>
<p className="mb-5 mt-5  text-black sm:text-lg">
The Service makes use of various Artificial Intelligence ("AI") models and services. All data produced by such models and services and provided to you is intended for use solely by you at your own discretion. We do not use the output data produced by the Service for training or developing other AI models. We do not sell or share the output data produced by the Service with any third parties.

Any input data you send to us (e.g. an image file) for the purpose of receiving back output from an AI model is used by us solely for the purpose of generating output to return back to you. We do not use the input data you send to us for training or developing other AI models. We do not permanently store, sell, or share the input data you send to us when using the Service.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Use of our Developer API
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
You may use our Developer API in conjunction with your account to utilize the services we offer. The following are restrictions on the use of our Developer API that you agree to when you sign up to our Service:

You MAY NOT:

Use our Developer API to provide a materially similar or competing Service to ours.
Consistently violate the rate limits stated on the various API endpoints.
Doing any of these may result in your account being terminated without a refund.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Materials provided to PropertyListingsAI.com or posted on any PropertyListingsAI LLC web page
</h2> 
<p className="mb-5 mt-5  text-black sm:text-lg">
PropertyListingsAI LLC does not claim ownership of the materials you provide to PropertyListingsAI.com (including feedback and suggestions) or post, upload, input or submit to any PropertyListingsAI LLC Site or our associated services (collectively "Submissions").

By posting, uploading, inputting, providing or submitting your Submission you warrant and represent that you own or otherwise control all of the rights to your Submission as described in this section including, without limitation, all the rights necessary for you to provide, post, upload, input or submit the Submissions.

No Adult Content. Use of adult content, including images, videos, or other media depicting pornography, child pornography, bestiality, hate crimes, violent crimes, war crimes, or similar depictions, is strictly prohibited and is a violation of these Terms and Conditions.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Third Party Accounts
</h2>
<p className="mb-5 mt-5  text-black sm:text-lg">
You will be able to connect your PropertyListingsAI LLC account to third party accounts. By connecting your PropertyListingsAI LLC account to your third party account, you acknowledge and agree that you are consenting to the continuous release of information about you to others (in accordance with your privacy settings on those third party sites). If you do not want information about you to be shared in this manner, do not use this feature.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
International Users</h2>


<p className="mb-5 mt-5  text-black sm:text-lg">
The Service is controlled, operated and administered by PropertyListingsAI LLC from our offices within the USA. If you access the Service from a location outside the USA, you are responsible for compliance with all local laws. You agree that you will not use the PropertyListingsAI LLC Content accessed through PropertyListingsAI.com in any country or in any manner prohibited by any applicable laws, restrictions or regulations.

The Service uses Amazon Web Services (AWS) for website hosting, information technology and infrastructure services. Any personal data and purchase information is stored with AWS. PropertyListingsAI LLC has a data processor contract with AWS for processing of personal data and AWS has certified to the EU-US Privacy Shield.

Credit card payments are processed by Stripe Payments Europe, Ltd. Tokenised payment information is used to securely process payments. Card number, expiry date and CVC cardholder information is stored only on the servers of Stripe. For payment purposes Stripe may disclose data to banks and credit card networks. Stripe has certified to the EU-US Privacy Shield.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Indemnification
</h2>
<p className="mb-5 mt-5  text-black sm:text-lg">
You agree to indemnify, defend and hold harmless PropertyListingsAI LLC, its officers, directors, employees, agents and third parties, for any losses, costs, liabilities and expenses (including reasonable attorneys' fees) relating to or arising out of your use of or inability to use the Site or services, any user postings made by you, your violation of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable laws, rules or regulations. PropertyListingsAI LLC reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with PropertyListingsAI LLC in asserting any available defenses.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Liability disclaimer
</h2>
<p className="mb-5 mt-5  text-black sm:text-lg">
THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. PropertyListingsAI LLC AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.

PropertyListingsAI LLC AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE PROVIDED "AS IS" WITHOUT WARRANTY OR CONDITION OF ANY KIND. PropertyListingsAI LLC AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PropertyListingsAI LLC AND/OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SITE, WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED THROUGH THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE SITE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, EVEN IF PropertyListingsAI LLC OR ANY OF ITS SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. BECAUSE SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.
</p>
<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Termination/access restriction
</h2>

<p className="mb-5 mt-5  text-black sm:text-lg">
PropertyListingsAI LLC reserves the right, in its sole discretion, to terminate your access to the Site and the related services or any portion thereof at any time, without notice. To the maximum extent permitted by law, this agreement is governed by the laws of the State of New Jersey and you hereby consent to the exclusive jurisdiction and venue of courts in New Jersey in all disputes arising out of or relating to the use of the Site. Use of the Site is unauthorized in any jurisdiction that does not give effect to all provisions of these Terms, including, without limitation, this section.

You agree that no joint venture, partnership, employment, or agency relationship exists between you and PropertyListingsAI LLC as a result of this agreement or use of the Site. PropertyListingsAI LLC's performance of this agreement is subject to existing laws and legal process, and nothing contained in this agreement is in derogation of PropertyListingsAI LLC's right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or information provided to or gathered by PropertyListingsAI LLC with respect to such use. If any part of this agreement is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the agreement shall continue in effect.

Unless otherwise specified herein, this agreement constitutes the entire agreement between the user and PropertyListingsAI LLC with respect to the Site and it supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written, between the user and PropertyListingsAI LLC with respect to the Site. A printed version of this agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent an d subject to the same conditions as other business documents and records originally generated and maintained in printed form. It is the express wish to the parties that this agreement and all related documents be written in English.
</p>

<h2 className="mb-4 mt-4 text-2xl tracking-tight font-bold text-black ">
Changes to Terms
</h2>
<p className="mb-5 mt-5  text-black sm:text-lg">
PropertyListingsAI LLC reserves the right, in its sole discretion, to change the Terms under which PropertyListingsAI.com is offered. The most current version of the Terms will supersede all previous versions. PropertyListingsAI LLC encourages you to periodically review the Terms to stay informed of our updates.
         </p>

         <h2 className="text-2xl font-bold mt-8 mb-8 text-black">Data Deletion</h2>
          <p className="leading-relaxed text-lg mt-4">
          We don’t store any personal information. However, we do store your email to process payments and provide access to our services. If you’d like your email removed from our database, please email us at balt1794@gmail.com with the subject and body: Account Deletion Request</p>
        



         </p>
    </section>
    </>
  );
};

export default TermsOfUse;