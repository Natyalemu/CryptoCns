// frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
  const encryptAlgorithm = document.getElementById('encryptAlgorithm');
  const encryptText = document.getElementById('encryptText');
  const encryptKey = document.getElementById('encryptKey');
  const encryptBtn = document.getElementById('encryptBtn');
  const encryptResult = document.getElementById('encryptResult');

  const decryptAlgorithm = document.getElementById('decryptAlgorithm');
  const decryptText = document.getElementById('decryptText');
  const decryptKey = document.getElementById('decryptKey');
  const decryptIV = document.getElementById('decryptIV');
  const decryptBtn = document.getElementById('decryptBtn');
  const decryptResult = document.getElementById('decryptResult');
  const ivField = document.getElementById('ivField');

  // Show or hide IV field based on decryption algorithm selection
  decryptAlgorithm.addEventListener('change', () => {
    const algo = decryptAlgorithm.value;
    if (algo === '3des' || algo === 'aes') {
      ivField.style.display = 'block';
    } else {
      ivField.style.display = 'none';
    }
  });

  // For encryption, disable key input for OTP (server generates key)
  encryptAlgorithm.addEventListener('change', () => {
    const algo = encryptAlgorithm.value;
    if (algo === 'otp') {
      encryptKey.disabled = true;
      encryptKey.placeholder = 'Key not required for OTP';
    } else {
      encryptKey.disabled = false;
      if (algo === '3des') {
        encryptKey.placeholder = 'Enter 24-byte (48 hex chars) key';
      } else if (algo === 'aes') {
        encryptKey.placeholder = 'Enter 32-byte (64 hex chars) key';
      }
    }
  });

  encryptBtn.addEventListener('click', async () => {
    const algo = encryptAlgorithm.value;
    const text = encryptText.value.trim();
    let url = '';
    let body = {};

    if (!text) {
      encryptResult.innerText = 'Please enter plaintext.';
      return;
    }

    if (algo === 'otp') {
      url = '/otp-encrypt';
      body = { text };
    } else if (algo === '3des') {
      url = '/3des-encrypt';
      const key = encryptKey.value.trim();
      if (!key) {
        encryptResult.innerText = 'Please enter a valid key.';
        return;
      }
      body = { text, key };
    } else if (algo === 'aes') {
      url = '/aes-encrypt';
      const key = encryptKey.value.trim();
      if (!key) {
        encryptResult.innerText = 'Please enter a valid key.';
        return;
      }
      body = { text, key };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      encryptResult.innerText = JSON.stringify(data, null, 2);
    } catch (err) {
      encryptResult.innerText = 'Error: ' + err;
    }
  });

  decryptBtn.addEventListener('click', async () => {
    const algo = decryptAlgorithm.value;
    const text = decryptText.value.trim();
    const key = decryptKey.value.trim();
    let url = '';
    let body = {};

    if (!text || !key) {
      decryptResult.innerText = 'Please enter both ciphertext and key.';
      return;
    }

    if (algo === 'otp') {
      url = '/otp-decrypt';
      body = { ciphertext: text, key };
    } else if (algo === '3des') {
      url = '/3des-decrypt';
      const iv = decryptIV.value.trim();
      if (!iv) {
        decryptResult.innerText = 'Please enter IV for 3DES.';
        return;
      }
      body = { text, key, iv };
    } else if (algo === 'aes') {
      url = '/aes-decrypt';
      const iv = decryptIV.value.trim();
      if (!iv) {
        decryptResult.innerText = 'Please enter IV for AES.';
        return;
      }
      body = { text, key, iv };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      decryptResult.innerText = JSON.stringify(data, null, 2);
    } catch (err) {
      decryptResult.innerText = 'Error: ' + err;
    }
  });
});
