import 'core-js';
import 'normalize.css';
import './index.scss';
import { t } from 'ttag';
import { isDuringLiffRedirect } from './lib';
import App from './App.svelte';

liff.init({ liffId: LIFF_ID }).then(() => {
  // liff.init should have corrected the path now, don't initialize app and just wait...
  // Ref: https://www.facebook.com/groups/linebot/permalink/2380490388948200/?comment_id=2380868955577010
  if (isDuringLiffRedirect) return;

  // Commenting this secion out during LIFF development to enable debugging on desktop
  // (Can do everything except liff.sendMessage)
  //
  if (!liff.isInClient()) {
    alert(
      t`Sorry, the function is not applicable on desktop.` +
        '\n' +
        t`Please proceed on your mobile phone.` +
        ' 📲 '
    );
    liff.closeWindow();
  }

  if (!liff.isLoggedIn()) {
    liff.login({
      // redirectUri:
      // will default redirect to endpointURL set in Line LOGIN developer console.
    });
  }

  // Cleanup loading
  document.getElementById('loading').remove();
  new App({ target: document.body });
});
