const briefForm = document.querySelector("#brief-form");
const service = document.querySelector("#service");
const company = document.querySelector("#company");
const details = document.querySelector("#details");
const status = document.querySelector("#brief-status");
const output = document.querySelector("#brief-output");
const outputLabel = document.querySelector("#brief-output-label");
const languageSwitches = document.querySelectorAll("a[hreflang]");
const arabic = document.documentElement.lang === "ar";
const labels = arabic ? {
  title: "موجز مشروع وي سايت",
  service: "الخدمة",
  business: "المنشأة",
  details: "تفاصيل المشروع",
  empty: "يرجى توضيح ما ترغب في تحقيقه.",
  copied: "تم نسخ الموجز.",
  selectCopy: "انسخ النص المحدّد للاحتفاظ بالموجز.",
  downloaded: "الموجز جاهز. ستجده في تنزيلات المتصفّح.",
  filename: "wecite-project-brief-ar.txt",
} : {
  title: "Wecite project brief",
  service: "Service",
  business: "Business",
  details: "Project details",
  empty: "Please describe what you would like to achieve.",
  copied: "Brief copied.",
  selectCopy: "Copy the selected text to keep your brief.",
  downloaded: "Your brief is ready. Check your browser's downloads.",
  filename: "wecite-project-brief.txt",
};

const requestedService = new URLSearchParams(window.location.search).get("service");
if (Array.from(service.options).some((option) => option.value === requestedService)) {
  service.value = requestedService;
}
function updateLanguageLinks() {
  for (const link of languageSwitches) {
    const destination = new URL(link.href);
    if (service.value) destination.searchParams.set("service", service.value);
    else destination.searchParams.delete("service");
    link.href = destination.href;
  }
}
updateLanguageLinks();
service.addEventListener("change", updateLanguageLinks);

function prepareBrief() {
  const parts = [labels.title, "", labels.service + ": " + service.selectedOptions[0].text];
  if (company.value.trim()) parts.push(labels.business + ": " + company.value.trim());
  parts.push("", labels.details, details.value.trim(), "");
  return parts.join("\n");
}

function downloadBrief(brief) {
  const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = labels.filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

details.addEventListener("input", () => details.setCustomValidity(""));

briefForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!details.value.trim()) {
    details.setCustomValidity(labels.empty);
    details.reportValidity();
    return;
  }

  const brief = prepareBrief();
  output.value = brief;
  outputLabel.hidden = false;
  output.hidden = false;

  if (event.submitter?.value === "copy") {
    try {
      await navigator.clipboard.writeText(brief);
      status.textContent = labels.copied;
    } catch {
      output.focus();
      output.select();
      status.textContent = labels.selectCopy;
    }
  } else {
    downloadBrief(brief);
    status.textContent = labels.downloaded;
  }
});

briefForm.hidden = false;
