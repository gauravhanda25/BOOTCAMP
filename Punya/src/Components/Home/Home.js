import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }


  render() {
    return (
      <div>
        <section className="banner_part">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-7">
                <div className="banner_text text-center">
                  <div className="banner_text_iner">
                    <h1>Help The <br />
                      Children in Need </h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt
                      ut</p>
                    <a href="#" className="btn_2">Start Donation</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="banner_video">
                  <div className="banner_video_iner">
                    <img src="img/banner_video.png" alt="" />
                    <div className="extends_video">
                      <a id="play-video_1" className="video-play-button popup-youtube" href="https://www.youtube.com/watch?v=pBFQdxA-apI">
                        <span className="fas fa-play" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* banner part start*/}
        {/* service part start*/}
        <section className="service_part">
          <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-4 col-sm-10">
                <div className="service_text">
                  <h2>We are CharityPress
                    Funding Network
                    Worldwide.</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    Lorem ipsum dolor sit amet consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna </p>
                  <a href="service.html" className="btn_3">learn more</a>
                </div>
              </div>
              <div className="col-lg-7 col-xl-6">
                <div className="service_part_iner">
                  <div className="row">
                    <div className="col-lg-6 col-sm-6">
                      <div className="single_service_text ">
                        <i className="flaticon-money" />
                        <h4>Donation</h4>
                        <p>Lorem ipsum dolor sit amet consectetur elit seiusmod tempor incididunt</p>
                        <a href="#">donate now</a>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="single_service_text">
                        <i className="flaticon-money" />
                        <h4>Adopt A Child</h4>
                        <p>Lorem ipsum dolor sit amet consectetur elit seiusmod tempor incididunt</p>
                        <a href="#">contact us</a>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="single_service_text">
                        <i className="flaticon-money" />
                        <h4>Become A Volunteer</h4>
                        <p>Lorem ipsum dolor sit amet consectetur elit seiusmod tempor incididunt</p>
                        <a href="#">read more</a>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="single_service_text">
                        <i className="flaticon-money" />
                        <h4>Donation</h4>
                        <p>Lorem ipsum dolor sit amet consectetur elit seiusmod tempor incididunt</p>
                        <a href="#">donate now</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* service part end*/}
        {/* about part end*/}
        <section className="about_us">
          <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-6">
                <div className="about_us_img">
                  <img src="img/top_service.png" alt="" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about_us_text">
                  <h5>
                    2000<br /><span>since</span>
                  </h5>
                  <h2>About Believe</h2>
                  <p>According to the research firm Frost &amp; Sullivan, the estimated
                    size of the North American used test and measurement equipment
                    market was $446.4 million in 2004 and is estimated to grow to
                    $654.5 million by 2011. For over 50 years, companies and governments
                    have procured used test and measurement instruments.</p>
                  <div className="banner_item">
                    <div className="single_item">
                      <h2> <span className="count">50</span>k</h2>
                      <h5>Total
                        Volunteer</h5>
                    </div>
                    <div className="single_item">
                      <h2><span className="count">25</span>k</h2>
                      <h5>Successed
                        Mission</h5>
                    </div>
                    <div className="single_item">
                      <h2><span className="count">100</span>k</h2>
                      <h5>Total
                        Collection</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="text-center about_btn">
                  <a className="btn_3 " href="#">learn more</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* about part end*/}
        {/*::passion part start::*/}
        <section className="passion_part passion_section_padding">
          <div className="container">
            <div className="row">
              <div className="col-xl-5 col-md-8">
                <div className="section_tittle">
                  <h2>Our Causes</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-4 col-xl-4">
                <div className="single-home-passion">
                  <div className="card">
                    <img src="img/passion/passion_1.png" className="card-img-top" alt="blog" />
                    <div className="card-body">
                      <a href="#">
                        <h5 className="card-title">Fourth created forth fill
                          created subdue be </h5>
                      </a>
                      <ul>
                        <li><img src="img/icon/passion_1.svg" alt="" /> Goal: $2500</li>
                        <li><img src="img/icon/passion_2.svg" alt="" /> Raised: $1533</li>
                      </ul>
                      <div className="skill">
                        <div className="skill-bar skill11 wow slideInLeft animated">
                          <span className="skill-count11">75%</span>
                        </div>
                      </div>
                      <a href="#" className="btn_2">read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xl-4">
                <div className="single-home-passion">
                  <div className="card">
                    <img src="img/passion/passion_2.png" className="card-img-top" alt="blog" />
                    <div className="card-body">
                      <a href="#">
                        <h5 className="card-title">Fourth created forth fill
                          created subdue be </h5>
                      </a>
                      <ul>
                        <li><img src="img/icon/passion_1.svg" alt="" /> Goal: $2500</li>
                        <li><img src="img/icon/passion_2.svg" alt="" /> Raised: $1533</li>
                      </ul>
                      <div className="skill">
                        <div className="skill-bar skill11 wow slideInLeft animated">
                          <span className="skill-count11">75%</span>
                        </div>
                      </div>
                      <a href="#" className="btn_2">read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xl-4">
                <div className="single-home-passion">
                  <div className="card">
                    <img src="img/passion/passion_3.png" className="card-img-top" alt="blog" />
                    <div className="card-body">
                      <a href="#">
                        <h5 className="card-title">Fourth created forth fill
                          created subdue be </h5>
                      </a>
                      <ul>
                        <li><img src="img/icon/passion_1.svg" alt="" /> Goal: $2500</li>
                        <li><img src="img/icon/passion_2.svg" alt="" /> Raised: $1533</li>
                      </ul>
                      <div className="skill">
                        <div className="skill-bar skill11 wow slideInLeft animated">
                          <span className="skill-count11">75%</span>
                        </div>
                      </div>
                      <a href="#" className="btn_2">read more</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*::passion part end::*/}
        {/* intro_video_bg start*/}
        <section className="intro_video_bg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-8">
                <div className="intro_video_iner text-center">
                  <h2>Please raise your hand &amp; Save world </h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Quis ipsum suspendisse ultrices gravida.</p>
                  <a href="#" className="btn_2">Become a Volunteer</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* intro_video_bg part start*/}
        {/*::event_part start::*/}
        <section className="event_part">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-md-8">
                <div className="section_tittle">
                  <h2>Upcoming Event</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="single_event media">
                  <img src="img/event_1.png" className="align-self-center" alt="..." />
                  <div className="tricker">10 Jun</div>
                  <div className="media-body align-self-center">
                    <h5 className="mt-0">Volunteeer Idea 2020</h5>
                    <p>Seed the life upon you are creat.</p>
                    <ul>
                      <li><span id="days" />days</li>
                      <li><span id="hours" />Hours</li>
                      <li><span id="minutes" />Minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="single_event media">
                  <img src="img/event_2.png" className="align-self-center" alt="..." />
                  <div className="tricker">10 Jun</div>
                  <div className="media-body align-self-center">
                    <h5 className="mt-0">Volunteeer Idea 2020</h5>
                    <p>Seed the life upon you are creat.</p>
                    <ul>
                      <li><span id="days1" />days</li>
                      <li><span id="hours1" />Hours</li>
                      <li><span id="minutes1" />Minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="single_event media">
                  <img src="img/event_3.png" className="align-self-center" alt="..." />
                  <div className="tricker">10 Jun</div>
                  <div className="media-body align-self-center">
                    <h5 className="mt-0">Volunteeer Idea 2020</h5>
                    <p>Seed the life upon you are creat.</p>
                    <ul>
                      <li><span id="days2" />days</li>
                      <li><span id="hours2" />Hours</li>
                      <li><span id="minutes2" />Minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="single_event media">
                  <img src="img/event_4.png" className="align-self-center" alt="..." />
                  <div className="tricker">10 Jun</div>
                  <div className="media-body align-self-center">
                    <h5 className="mt-0">Volunteeer Idea 2020</h5>
                    <p>Seed the life upon you are creat.</p>
                    <ul>
                      <li><span id="days3" />days</li>
                      <li><span id="hours3" />Hours</li>
                      <li><span id="minutes3" />Minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*::event_part end::*/}
        {/*::blog_part start::*/}
        <section className="blog_part padding_bottom">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-md-8">
                <div className="section_tittle text-center">
                  <h2>Blog Post</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                <div className="single_blog">
                  <div className="appartment_img">
                    <img src="img/blog/blog_1.png" alt="" />
                  </div>
                  <div className="single_appartment_content">
                    <a href="blog.html">
                      <h4>First cattle which earthcan get
                        and see what
                      </h4>
                    </a>
                    <p>et dolore magna aliqua. Quis ipsum susp endisse ultrices gravida.
                      Risus com modo viverra maecenas accumsan lacus vel. </p>
                    <ul className="list-unstyled">
                      <li><a href> <span className="flaticon-calendar" /> </a> May 10, 2019</li>
                      <li><a href> <span className="flaticon-comment" /> </a> 1 comments</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="single_blog">
                  <div className="appartment_img">
                    <img src="img/blog/blog_2.png" alt="" />
                  </div>
                  <div className="single_appartment_content">
                    <a href="blog.html">
                      <h4>First cattle which earthcan get
                        and see what
                      </h4>
                    </a>
                    <p>et dolore magna aliqua. Quis ipsum susp endisse ultrices gravida.
                      Risus com modo viverra maecenas accumsan lacus vel.
                    </p>
                    <ul className="list-unstyled">
                      <li><a href> <span className="flaticon-calendar" /> </a> May 10, 2019</li>
                      <li><a href> <span className="flaticon-comment" /> </a> 1 comments</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="single_blog">
                  <div className="appartment_img">
                    <img src="img/blog/blog_3.png" alt="" />
                  </div>
                  <div className="single_appartment_content">
                    <a href="blog.html">
                      <h4>First cattle which earthcan get
                        and see what
                      </h4>
                    </a>
                    <p>et dolore magna aliqua. Quis ipsum susp endisse ultrices gravida.
                      Risus com modo viverra maecenas accumsan lacus vel.
                    </p>
                    <ul className="list-unstyled">
                      <li><a href> <span className="flaticon-calendar" /> </a> May 10, 2019</li>
                      <li><a href> <span className="flaticon-comment" /> </a> 1 comments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*::blog_part end::*/}
        {/*::our client part start::*/}
        <section className="client_part padding_bottom">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6">
                <div className="section_tittle text-center">
                  <h2>Who Donate us</h2>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-lg-12">
                <div className="client_logo owl-carousel">
                  <div className="single_client_logo">
                    <img src="img/client_logo/Logo_1.png" alt="" />
                  </div>
                  <div className="single_client_logo">
                    <img src="img/client_logo/Logo_2.png" alt="" />
                  </div>
                  <div className="single_client_logo">
                    <img src="img/client_logo/Logo_3.png" alt="" />
                  </div>
                  <div className="single_client_logo">
                    <img src="img/client_logo/Logo_4.png" alt="" />
                  </div>
                  <div className="single_client_logo">
                    <img src="img/client_logo/Logo_5.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home));
