const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateInviteCode() {
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}
