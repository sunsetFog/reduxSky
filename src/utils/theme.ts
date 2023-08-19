export class Theme {
  private localKey = 'office-theme';
  private getLocalTheme = () => {
    // 默认黑夜
    return localStorage.getItem(this.localKey) === 'light' ? 'light' : 'dark'; // 兼容不同的主题命名
  };
  private setLocalTheme = (value) => {
    return localStorage.setItem(this.localKey, value);
  };
  public initTheme = () => {
    const theme = this.getTheme();
    const localTheme = this.getLocalTheme();
    if (localTheme === theme && theme) {
      return;
    }
    this.setTheme(localTheme);
    return { name: localTheme, isLight: localTheme === 'light' };
  };
  public getTheme = () => {
    return document.documentElement.getAttribute('data-theme');
  };
  public setTheme = (localTheme?) => {
    if (typeof localTheme !== 'string') {
      localTheme = this.getTheme() === 'light' ? 'dark' : 'light';
    }
    this.setLocalTheme(localTheme);
    document.documentElement.setAttribute('data-theme', localTheme);
    return { name: localTheme, isLight: localTheme === 'light' };
  };
}

export default new Theme();
