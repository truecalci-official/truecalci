/**
 * TrueCalci User Profile View
 * View and update user profile, linked identity, and developer credentials.
 */

export class ViewProfile {
  constructor(containerEl, onUpdate) {
    this.containerEl = containerEl;
    this.onUpdate = onUpdate;
    this.user = JSON.parse(localStorage.getItem("tc_dev_user") || '{}');
  }

  render() {
    const user = this.user;
    const name = user.name || "Developer";
    const handle = user.handle || "developer";
    const email = user.email || "developer@truecalci.com";
    const provider = user.provider ? user.provider.toUpperCase() : "GITHUB";
    const tier = user.tier || "Pro Agency & Scale";

    this.containerEl.innerHTML = `
      <div class="profile-container" style="max-width: 800px; margin: 0 auto; padding: 40px 20px 80px;">
        
        <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
          <h1 style="margin: 0 0 6px 0; font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">Developer Profile</h1>
          <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary);">Manage your identity, personal information, and developer credentials.</p>
        </div>

        <div class="glass-card" style="padding: 28px; border-radius: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 28px;">
          
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 28px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #24292f; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; overflow: hidden; border: 2px solid var(--accent-primary);">
              ${user.avatar_url ? `<img src="${user.avatar_url}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">` : name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${name}</h2>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">@${handle} • Authenticated via ${provider}</div>
              <div style="margin-top: 6px;">
                <span style="display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                  ${tier}
                </span>
              </div>
            </div>
          </div>

          <form id="profile-edit-form" style="display: flex; flex-direction: column; gap: 18px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Full Name / Display Name</label>
              <input type="text" id="profile-name-input" value="${name}" style="width: 100%; padding: 10px 14px; border-radius: 8px; background: var(--bg-app); border: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.88rem; outline: none;">
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Email Address</label>
              <input type="email" id="profile-email-input" value="${email}" style="width: 100%; padding: 10px 14px; border-radius: 8px; background: var(--bg-app); border: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.88rem; outline: none;">
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Developer Handle</label>
              <input type="text" id="profile-handle-input" value="${handle}" style="width: 100%; padding: 10px 14px; border-radius: 8px; background: var(--bg-app); border: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.88rem; outline: none;">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
              <button type="submit" style="padding: 10px 20px; border-radius: 8px; background: var(--accent-primary); color: #fff; font-weight: 600; font-size: 0.84rem; border: none; cursor: pointer;">
                Save Profile Changes
              </button>
            </div>
          </form>

        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const form = document.getElementById("profile-edit-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newName = document.getElementById("profile-name-input")?.value.trim() || this.user.name;
        const newEmail = document.getElementById("profile-email-input")?.value.trim() || this.user.email;
        const newHandle = document.getElementById("profile-handle-input")?.value.trim() || this.user.handle;

        this.user.name = newName;
        this.user.email = newEmail;
        this.user.handle = newHandle;
        localStorage.setItem("tc_dev_user", JSON.stringify(this.user));

        if (this.onUpdate) this.onUpdate();
        alert("Profile updated successfully!");
        this.render();
      });
    }
  }
}
