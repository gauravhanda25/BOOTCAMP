import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons/faCoffee';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons/faGooglePlus';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('guest-body')
    const userData = JSON.parse(localStorage.getItem('userData'));
    const languageData = JSON.parse(localStorage.getItem('languageData'))
    this.state = {
        globalLang: (languageData !== null && languageData.global !== null && languageData.global !== undefined) ? languageData.global : {},
      };
    }

  componentDidMount(){
    let rootHeight = document.getElementById('root').clientHeight;
    // let footer = document.getElementById('guest-footer-fixed');
    // if(footer != null && footer != undefined){
    //   let footerHeight = document.getElementById('guest-footer-fixed').clientHeight;
    //   if((rootHeight + footerHeight) > window.innerHeight){
    //     let footer = document.getElementById('guest-footer-fixed');
    //     footer.classList.remove('footer-fixed')
    //   }
    // }
   }

  render() {
    return (<footer className="footer_part">
  <div className="container">
    <div className="row justify-content-around">
      <div className="col-sm-6 col-lg-3">
        <div className="single_footer_part">
          <img src="img/footer_logo.png" className="footer_logo" alt="" />
          <p>Heaven fruitful doesn't over lesser days appear creeping seasons so behold bearing days open
          </p>
          <div className="work_hours">
            <h5>Working Hours:</h5>
            <ul>
              <li> <p> Monday-Friday:</p> <span> 8AM - 6PM</span></li>
              <li> <p>Saturday-Sunday:</p> <span> 8AM - 12PM</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-2">
        <div className="single_footer_part">
          <h4>Causes</h4>
          <ul className="list-unstyled">
            <li><a href>Boat Shippment</a></li>
            <li><a href>Services</a></li>
            <li><a href>Transport Planning</a></li>
            <li><a href>Transportation</a></li>
            <li><a href>Truck Delivery Checking</a></li>
          </ul>
        </div>
      </div>
      <div className="col-sm-6 col-lg-3">
        <div className="single_footer_part footer_3">
          <h4> our Gallery</h4>
          <div className="footer_img">
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_1.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_2.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_3.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_4.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_5.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_6.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_7.png" alt="" />
            </div>
            <div className="single_footer_img">
              <img src="img/footer_img/footer_img_8.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-3">
        <div className="single_footer_part">
          <h4>Newsletter</h4>
          <p>Heaven fruitful doesn't over lesser in days. Appear creeping seasons deve behold bearing days
            open
          </p>
          <div id="mc_embed_signup">
            <form target="_blank" action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&id=92a4423d01" method="get" className="subscribe_form relative mail_part" required>
              <input type="email" name="email" id="newsletter-form-email" placeholder="Email Address" className="placeholder hide-on-focus" onfocus="this.placeholder = ''" onblur="this.placeholder = ' Email Address '" required />
              <button type="submit" name="submit" id="newsletter-submit" className="email_icon newsletter-submit button-contactForm"><i className="far fa-paper-plane" /></button>
              <div className="mt-10 info" />
            </form>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-lg-6">
        <div className="copyright_text">
          <p>{/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
            Copyright © All rights reserved | This template is made with <i className="ti-heart" aria-hidden="true" /> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
            {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}</p>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="footer_icon social_icon">
          <ul className="list-unstyled">
            <li><a href="#" className="single_social_icon"><i className="fab fa-facebook-f" /></a></li>
            <li><a href="#" className="single_social_icon"><i className="fab fa-twitter" /></a></li>
            <li><a href="#" className="single_social_icon"><i className="fas fa-globe" /></a></li>
            <li><a href="#" className="single_social_icon"><i className="fab fa-behance" /></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>
)
  }
}

export default Footer;
