// 自動填表 content script
chrome.storage.sync.get("userData", ({ userData }) => {
  if (!userData) return;

  function waitForElement(id, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const interval = 50;
      let elapsed = 0;
      const timer = setInterval(() => {
        const el = document.getElementById(id);
        if (el) {
          clearInterval(timer);
          resolve(el);
        }
        elapsed += interval;
        if (elapsed >= timeout) {
          clearInterval(timer);
          reject(`Timeout waiting for element ${id}`);
        }
      }, interval);
    });
  }

  async function setField(id, value) {
    try {
      const el = await waitForElement(id, 8000); // 等元素渲染
      if (!el) return;
      if (el.tagName === "SELECT") {
        el.value = value;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (el.type === "checkbox") {
        el.checked = !!value;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.blur();
      }
    } catch (e) {
      console.log(e);
    }
  }

  (async () => {
    await setField("dlslot_name_first", userData.first);
    await setField("dlslot_name_last", userData.last);
    await setField("dlslot_ticket_qty", userData.ticketQty);
    await setField("dlslot_email", userData.email);
    await setField("dlslot_dob_month", userData.dobMonth);
    await setField("dlslot_dob_day", userData.dobDay);
    await setField("dlslot_dob_year", userData.dobYear);
    await setField("dlslot_zip", userData.zip);
    await setField("dlslot_country", userData.country);
    await setField("dlslot_agree", true);
  })();
});
