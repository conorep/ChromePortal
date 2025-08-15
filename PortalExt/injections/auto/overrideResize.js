window.onresize = (e) => {
  if(e.isTrusted) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize', { bubbles: true }))
    }, 100);
  }
}