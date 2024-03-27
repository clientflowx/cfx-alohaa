console.log("script to inject razorpay logic initiated");
const razorpayBackendEndPointUrl =
  "https://cfx-mono-production-5ec7.up.railway.app";
const checkForValidUserFromRazorPayAccountListCache = () => {
  return window.razorpayList.includes(window.locationUserId);
};
const fetchRazorpayList = async () => {
  try {
    const apiUrl = `${razorpayBackendEndPointUrl}/api/razorpay/fetch-all-razorpay-accounts`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const { data } = await response.json();
    if (data) {
      const list = data;
      window.razorpayList = list.map((item) => item?.locationId);
      console.log("window.razorpaylist", window.razorpayList);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in fetchAllohaList:", error.message);
    return false;
  }
};
const isValidRazorpayUser = async () => {
  try {
    if (window.razorpayList?.length > 0) {
      return checkForValidUserFromRazorPayAccountListCache();
    }
    const hasFetchedRazorpayList = await fetchRazorpayList();
    if (hasFetchedRazorpayList) {
      return checkForValidUserFromRazorPayAccountListCache();
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in isValidRazorpayUser:", error.message);
    return false;
  }
};
async function initiateRazorpayScript() {
  const hasAccessToRazorpay = await isValidRazorpayUser();
  if (hasAccessToRazorpay) {
    triggerRazorpayLogic();
  } else {
    console.log("No access to Razorpay, sitting silent");
  }
}
function triggerRazorpayLogic() {
  console.log("This Sub account has access to razorpay");
  window.hasAccessToRazorpay = true;
  const invoicesPageRegex =
    /^https:\/\/app\.clientflowx\.com\/v2\/location\/[a-zA-Z0-9]+\/payments\/invoices(?!\/new)/;
  const transactionPageRegex =
    /^https:\/\/app\.clientflowx\.com\/v2\/location\/[a-zA-Z0-9]+\/payments\/v2\/transactions/;
  const integrationPageRegex =
    /^https:\/\/app\.clientflowx\.com\/v2\/location\/[a-zA-Z0-9]+\/payments\/integrations/;
  const conversationPageRegex =
    /^https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/conversations\/conversations\/[A-Za-z0-9]+/;
  const contactDetailPageRegex =
    /^https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/contacts\/detail\/[A-Za-z0-9]+/;
  function insertInoviceTab() {
    console.log("fn to insert invoice tab initiated");
    const timerId = setInterval(() => {
      const invoiceSection = document.querySelector("#paymentsApp");
      if (invoiceSection) {
        invoiceSection.innerHTML = "";
        const invoiceIframe = document.createElement("iframe");
        invoiceIframe.src = `https://staging.integrations.clientflowx.com/invoices?locationId=${window.locationUserId}`;
        invoiceIframe.id = "rzpInvoiceSection";
        invoiceSection.appendChild(invoiceIframe);
        clearInterval(timerId);
      }
    }, 100);
  }
  function insertTransactionTab() {
    console.log("fn to insert transaction tab initiated");
    const timerId = setInterval(() => {
      const transactionSection = document.querySelector("#paymentsApp");
      if (transactionSection) {
        transactionSection.innerHTML = "";
        console.log("invoice", transactionSection);
        const transactionIframe = document.createElement("iframe");
        transactionIframe.src = `https://staging.integrations.clientflowx.com/transactions?locationId=${window.locationUserId}`;
        transactionIframe.id = "rzpTransactionSection";
        transactionSection.appendChild(transactionIframe);
        clearInterval(timerId);
      }
    }, 100);
  }
  function insertIntegrationSection() {
    console.log("fn to insert rzp integration section initiated");
    const timerId = setInterval(() => {
      const integrationSection = document.querySelector(
        "ul.grid.grid-cols-3.items-start.gap-4"
      );
      if (integrationSection) {
        console.log("integration", integrationSection);
        const iframeLi = document.createElement("li");
        iframeLi.className =
          "bg-white border divide-gray-200 flex h-full hover:border-curious-blue-100 items-center justify-center px-8 rounded-lg shadow-md text-center w-full";
        const integrationIframe = document.createElement("iframe");
        integrationIframe.src = `https://staging.integrations.clientflowx.com/razorpay?locationId=${window.locationUserId}`;
        integrationIframe.id = "rzpIntegrationSection";
        integrationIframe.className = "h-full w-full";
        iframeLi.appendChild(integrationIframe);
        integrationSection.appendChild(iframeLi);
        clearInterval(timerId);
      }
    }, 100);
  }
  function insertRazorpayBtn() {
    const timerId = setInterval(() => {
      const toBeInserted = document.querySelector(
        "#message-composer > div > div.flex.items-center.pt-2.border-t > div:nth-child(1)"
      );
      const nameField = document.querySelector(
        "#new-crp--contacts > div.flex.flex-col.items-center.pt-\\[24px\\] > div.relative.flex.items-center.mt-2 > span > input"
      ).value;
      const isRzpInvoiceBtnAlreadyInserted =
        document.getElementById("rzpInvoiceBtn");
      if (toBeInserted) {
        clearInterval(timerId);
        if (isRzpInvoiceBtnAlreadyInserted) return;
        const razorpayContainer = document.createElement("div");
        razorpayContainer.id = "rzpInvoiceBtn";
        const razorpayBtn = document.createElement("div");
        razorpayBtn.className =
          "text-gray-500 h-8 w-8 flex justify-center items-center cursor-pointer rounded-full hover:bg-gray-100 transition duration-150 ease-in-out p-1.5  cursor-pointer";
        razorpayBtn.innerHTML = `<img src="https://res.cloudinary.com/dtqzhg98l/image/upload/v1711435176/favicon_ytrutv.png" alt="rzp_logo" />`;
        razorpayContainer.appendChild(razorpayBtn);
        toBeInserted.appendChild(razorpayContainer);
        razorpayContainer.addEventListener("click", () => {
          const isIframePresent = document.getElementById("payment-iframe");
          if (!isIframePresent) {
            const paymentIframe = document.createElement("iframe");
            paymentIframe.src = `https://staging.integrations.clientflowx.com/razorpay/payment?locationId=${window.locationUserId}`;
            paymentIframe.id = "payment-iframe";
            paymentIframe.allow = "clipboard-read; clipboard-write";
            paymentIframe.className = "fixed block h-full w-full z-[999]";
            document.body.appendChild(paymentIframe);
            console.log(paymentIframe, paymentIframe.contentWindow);
            paymentIframe.contentWindow.postMessage(nameField);

            function receiveMessage() {
              const isIframePresent = document.getElementById("payment-iframe");
              console.log("Message received", isIframePresent);
              isIframePresent.classList.add("hidden");
            }
            window.addEventListener("message", receiveMessage);
          } else if (isIframePresent.classList.contains("hidden")) {
            isIframePresent.contentWindow.postMessage(nameField);
            console.log("hiddennn");
            isIframePresent.className = "fixed block h-full w-full z-[999]";
          }
        });
      }
    }, 100);
  }
  let globalInsertRazorpayBtnTimerId;
  function attachEventListenerToToggleBtn() {
    globalInsertRazorpayBtnTimerId = setInterval(() => {
      insertRazorpayBtn();
    }, 100);
  }
  if (
    invoicesPageRegex.test(window.location.href) &&
    window.hasAccessToRazorpay
  ) {
    insertInoviceTab();
  }
  if (
    transactionPageRegex.test(window.location.href) &&
    window.hasAccessToRazorpay
  ) {
    insertTransactionTab();
  }
  if (
    integrationPageRegex.test(window.location.href) &&
    window.hasAccessToRazorpay
  ) {
    insertIntegrationSection();
  }
  if (
    conversationPageRegex.test(window.location.href) &&
    window.hasAccessToRazorpay
  ) {
    clearInterval(globalInsertRazorpayBtnTimerId);
    attachEventListenerToToggleBtn();
  }
  if (
    contactDetailPageRegex.test(window.location.href) &&
    window.hasAccessToRazorpay
  ) {
    clearInterval(globalInsertRazorpayBtnTimerId);
    attachEventListenerToToggleBtn();
  }
  window.addEventListener("routeChangeEvent", function () {
    if (
      invoicesPageRegex.test(window.location.href) &&
      window.hasAccessToRazorpay
    ) {
      insertInoviceTab();
    } else {
      const isInvoiceTabInserted = document.getElementById("rzpInvoiceSection");
      if (isInvoiceTabInserted) {
        isInvoiceTabInserted.remove();
      }
    }
    if (
      transactionPageRegex.test(window.location.href) &&
      window.hasAccessToRazorpay
    ) {
      insertTransactionTab();
    } else {
      const isTransactionTabInserted = document.getElementById(
        "rzpTransactionSection"
      );
      if (isTransactionTabInserted) {
        isTransactionTabInserted.remove();
      }
    }
    if (
      integrationPageRegex.test(window.location.href) &&
      window.hasAccessToRazorpay
    ) {
      insertIntegrationSection();
    } else {
      const isIntegrationSectionInserted = document.getElementById(
        "rzpIntegrationSection"
      );
      if (isIntegrationSectionInserted) {
        isIntegrationSectionInserted.remove();
      }
    }
    if (
      (conversationPageRegex.test(window.location.href) ||
        contactDetailPageRegex.test(window.location.href)) &&
      window.hasAccessToRazorpay
    ) {
      clearInterval(globalInsertRazorpayBtnTimerId);
      attachEventListenerToToggleBtn();
    } else {
      const isRzpInvoiceBtn = document.getElementById("rzpInvoiceBtn");
      if (isRzpInvoiceBtn) {
        isRzpInvoiceBtn.remove();
      }
      clearInterval(globalInsertRazorpayBtnTimerId);
    }
  });
}
initiateRazorpayScript();
