import { profile } from '../config.js'

export default function Footer() {
  return <footer className="site-footer"><div className="section-wrap footer-inner"><a href="#home" className="wordmark"><span>whoami</span><i>—</i></a><p>© {new Date().getFullYear()} {profile.name}</p><a href="#home" className="back-top">Back to top <span aria-hidden="true">↑</span></a></div></footer>
}
