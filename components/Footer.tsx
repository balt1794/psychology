import Link from "next/link";


export const Footer = () => {
  return (

<footer className=" ">
    <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <a href="https://propertylistingsai.com/" className="flex items-center">
                  <span className="self-center text-xl lg:text-2xl  font-semibold whitespace-nowrap text-black">Property</span>
                  <span className="self-center text-xl lg:text-2xl  font-semibold whitespace-nowrap text-black">ListingsAI</span>
              </a>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4  hidden">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black">Links</h2>
                  <ul className="text-gray-500  ">
                      <li className="mb-4 hover:underline">
                      <a href="https://wordpress.org/plugins/alt-text-generator-ai/" title="propertylistingsAI WordPress Plugin">WordPress Plugin</a> </li>
                      <li className="mb-4 hover:underline">
                      <a href="https://apps.shopify.com/propertylistings" title="propertylistingsAI Shopify App">Shopify App</a> </li>
                      <li className="mb-4 hover:underline">
                      <a href="https://chromewebstore.google.com/detail/propertylistingsaicom-alt/nglpjpmfjojeabiddbdicieeodjnfdif" title="propertylistingsAI Chrome Extension">Chrome Extension</a> </li>
                      <li className="mb-4 hover:underline">
                      <a href="https://iuu.ai/">iuu AI</a> </li>  
                      <li>
                      <a href="https://www.aiheron.com/" title="Smart Lu AI Navigation">AiHeron</a>
                        </li> 
 </ul>
              </div>

              <div className="ml-4 hidden">
                  <h2 className="mb-6 text-sm font-semibold text-black uppercase dark:text-black">RESUME TEMPLATES</h2>
                  <ul className="text-gray-300 dark:text-gray-300 font-medium">
                     
                
                  </ul>
              </div>

           <div className="ml-0 lg:ml-12 hidden">
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black">Follow Us</h2>
                  <ul className="text-gray-300 dark:text-gray-300 font-medium">
                      <li className="mb-4">
                          <a href="https://www.linkedin.com/company/resumeboostai/" className="hover:underline ">LinkedIn</a>
                      </li>
                      <li className="mb-4">
                          <a href="   https://www.tiktok.com/@balt1794" className="hover:underline ">TikTok</a>
                      </li>
                      <li className="mb-4">
                          <a href="https://www.instagram.com/resumeboostai/" className="hover:underline ">Instagram</a>
                      </li>
                      <li className="mb-4">
                          <a href="https://www.pinterest.com/resumeboostai/" className="hover:underline ">Pinterest</a>
                      </li>
                  </ul>
              </div>

              
              <div className="ml-0 lg:-ml-10 hidden">
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black">Legal</h2>
                  <ul className="text-gray-300 dark:text-gray-300 font-medium">
                      <li className="mb-4">
                          <a href="/privacy" className="hover:underline">Privacy Policy</a>
                      </li>
                      <li className="mb-4">
                          <a href="/privacy-chrome-extensions" className="hover:underline">Privacy Policy Chrome Extension</a>
                      </li>
                        {/*
                      <li>
                          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                      </li>
                      */}
                  </ul>
              </div>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-black sm:text-center dark:text-black">© 2025 <a href="https://propertylistingsai.com/" className="hover:underline">PropertyListingsAI™</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            
              <a href="https://twitter.com/balt1794" target="_blank" className="text-black hover:text-[#795BEF] dark:hover:text-[#795BEF] ms-5">
                  <svg className="w-8 h-8 hidden lg:block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" />
                </svg>
                  <span className="sr-only">Twitter page</span>
              </a>

             
          </div>
      </div>
    </div>
</footer>

  );
}