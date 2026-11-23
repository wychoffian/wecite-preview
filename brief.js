const briefForm = document.querySelector("#brief-form");
const service = document.querySelector("#service");
const company = document.querySelector("#company");
const details = document.querySelector("#details");
const status = document.querySelector("#brief-status");
const output = document.querySelector("#brief-output");
const outputLabel = document.querySelector("#brief-output-label");

const requestedService = new URLSearchParams(window.location.search).get("service");
if (Array.from(service.options).some((option) => option.value === requestedService)) {
  service.value = requestedService;
}

function prepareBrief() {
  const parts = ["Wecite project brief", "", "Service: " + service.selectedOptions[0].text];
  if (company.value.trim()) parts.push("Business: " + company.value.trim());
  parts.push("", "Project details", details.value.trim(), "");
  return parts.join("\n");
}

function downloadBrief(brief) {
  const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "wecite-project-brief.txt";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

details.addEventListener("input", () => details.setCustomValidity(""));

briefForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!details.value.trim()) {
    details.setCustomValidity("Please describe what you want to build.");
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
      status.textContent = "Brief copied.";
    } catch {
      output.focus();
      output.select();
      status.textContent = "Copy the selected text to keep your brief.";
    }
  } else {
    downloadBrief(brief);
    status.textContent = "Your brief is ready. Check your browser's downloads.";
  }
});

briefForm.hidden = false;
