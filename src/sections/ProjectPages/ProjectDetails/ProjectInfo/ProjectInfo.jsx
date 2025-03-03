import Link from "next/link";
import Countdown, { zeroPad } from 'react-countdown';
import ProgressBar from "@components/progressBar";
import Button from "src/components/button";

import projectIcon from "@assets/images/project/ninga-image.png"
import coinIcon from "@assets/images/project/icon-2.png"
import socialData from "@assets/data/social/dataV1"

import ProjectInfoStyleWrapper from "./ProjectInfo.style";

const ProjectInfo = () => {

  const CountdownRender = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="countdown_wrapper">
        <div className="displayedTime">
          <div className="countBox">
            <div className="countBoxItem">
              <div className="count">{zeroPad(days)}</div>
              <div className="label"><span>D</span></div>
            </div>
            <div className="countBoxItem">
              <div className="count">{zeroPad(hours)}</div>
              <div className="label"><span>H</span></div>
            </div>
            <div className="countBoxItem">
              <div className="count">{zeroPad(minutes)}</div>
              <div className="label"><span>M</span></div>
            </div>
            <div className="countBoxItem">
              <div className="count">{zeroPad(seconds)}</div>
              <div className="label"><span>S</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProjectInfoStyleWrapper className="live_project_wrapper">
      <div className="game-price-item">
        <div className="game-price-inner">
          <div className="total-price">
            <div className="price-inner d-flex">
              <div className="image-icon">
                <img src={projectIcon.src} alt="icon" />
              </div>
              <div className="price-details">
                <h3>
                  <a>The Wasted Lands</a>
                </h3>
                <div className="dsc">PRICE (DDO) = 0.13 BUSD</div>
              </div>
            </div>
            <div className="all-raise">
              Total Raise 75,999.70 BUSD ( 86% )
            </div>
          </div>
          <div className="allocation-max text-center">
            <img src={coinIcon.src} alt="icon" />
            <div className="allocation">
              Allocation: 500 BUSD Max
            </div>
          </div>
          <div className="targeted-raise">
            <div className="seles-end-text">Sale End In</div>
            <Countdown date="2024-02-01T01:02:03" renderer={CountdownRender} />
            <div className="targeted-raise-amount">
              Targeted Raise 100,000 BUSD
            </div>
          </div>
        </div>
        <div className="progress-inner">
          <ProgressBar progress="83%" />
        </div>

        <div className="project_card_footer">
          <Button sm>
            Claim Token
          </Button>
          <div className="participants">Participants 4017/5000</div>
          <div className="social_links">
            {socialData?.map((profile, i) => (
              <Link key={i} href={profile.url}>
                <img src={profile.icon.src} alt="icon" />
              </Link>
            ))}

          </div>
        </div>
      </div>
    </ProjectInfoStyleWrapper>
  );
};

export default ProjectInfo;
