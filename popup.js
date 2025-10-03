document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);

    const first = $("first");
    const last = $("last");
    const email = $("email");
    const dobMonth = $("dobMonth");
    const dobDay = $("dobDay");
    const dobYear = $("dobYear");
    const zip = $("zip");
    const country = $("country");
    const ticketQty = $("ticketQty");
    const update = $("update");
    const save = $("save");
    const autofill = $("autofill");

    chrome.storage.sync.get("userData", ({ userData }) => {
        if (userData) {
            first.value = userData.first || "";
            last.value = userData.last || "";
            email.value = userData.email || "";
            dobMonth.value = userData.dobMonth || "";
            dobDay.value = userData.dobDay || "";
            dobYear.value = userData.dobYear || "";
            zip.value = userData.zip || "";
            country.value = userData.country || "";
            ticketQty.value = userData.ticketQty || "";
        }
    });

    update.addEventListener("click", () => {
        document.getElementById("infoSection").classList.toggle("hidden");
    });

    save.addEventListener("click", () => {
        const userData = {
            first: first.value,
            last: last.value,
            email: email.value,
            dobMonth: dobMonth.value,
            dobDay: dobDay.value,
            dobYear: dobYear.value,
            zip: zip.value,
            country: country.value,
            ticketQty: ticketQty.value
        };
        chrome.storage.sync.set({ userData }, () => {
            alert("Saved successfully!");
            document.getElementById("infoSection").classList.toggle("hidden");
        });
    });

    autofill.addEventListener("click", async () => {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: () => {
                const links = Array.from(document.querySelectorAll('a[href*="window=popup"]'));
                return links.map(l => l.href);
            }
            }, async (results) => {
            const urls = results[0].result;
            if (!urls || urls.length === 0) return alert("Cannot find any lottery popup links.");

            for (const url of urls) {
                const tabs = await chrome.tabs.query({ url });
                if (tabs.length === 0) {
                    await chrome.tabs.create({ url, active: false });
                }
            }
        });
    });
});
