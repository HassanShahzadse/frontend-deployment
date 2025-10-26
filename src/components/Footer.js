// src/components/Footer.js
import React from "react";

const Footer = () => (
  <footer class="bg-white sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8 antialiased  mx-48 mt-12 rounded-lg">
    <p class="mb-4 text-sm text-center text-gray-500 sm:mb-0">
      &copy; 2025{" "}
      <a href="https://asseco.com/" class="hover:underline" target="_blank">
        Asseco Poland S.A
      </a>
      . All rights reserved.
    </p>
    <div class="flex justify-center items-center space-x-1"></div>
    <p class="mb-4 text-sm text-center text-gray-500 sm:mb-0">
      <a
        href="https://asseco.com/privacy-policy/"
        class="hover:underline"
        target="_blank"
      >
        Privacy Policy
      </a>{" "}
      |{" "}
      <a
        href="https://www.blocklytics.net/terms_condition.html"
        class="hover:underline"
        target="_blank"
      >
        Terms & Condition
      </a>{" "}
      |{" "}
      <a
        href="https://docs.blocklytics.net"
        class="hover:underline"
        target="_blank"
      >
        Docs
      </a>
    </p>
  </footer>
);

export default Footer;
