"use client";

class AuthService {
  static setSession(user: any, userType: string) {
    document.cookie = `username=${user}; max-age=86400`; // 24 hours
    document.cookie = `userType=${userType}; max-age=86400`;
  }

  static removeSession() {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name =
        eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

      const paths = ["", "/", "/subpath"];

      paths.forEach((path) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      });
    });
  }

  static getSession() {
    const sessionCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    return sessionCookie ? JSON.parse(sessionCookie) : null;
  }
}

export default AuthService;
