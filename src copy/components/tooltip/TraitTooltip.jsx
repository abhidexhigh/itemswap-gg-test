import styled from "styled-components";
import { FaTint } from "react-icons/fa";
import ChineseArmor from "@assets/image/items/armors/chinese.png";

// Tooltip Container
const Tooltip = styled.div`
  background-color: #1e1e2f;
  color: white;
  padding: 10px;
  //   border-radius: 8px;
  font-size: 10px;
  //   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  display: inline-block;
  max-width: 300px; // Adjust as necessary
  //   border: 1px solid #555;
`;

// Header Section
const Header = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: space-between;
`;

// Body Section
const Body = styled.div`
  margin-bottom: 5px;
`;

// Footer Section
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Skill Icon
const SkillIcon = styled.img`
  width: 40px; // Adjust as necessary
  height: 40px; // Adjust as necessary
`;

// Skill Details
const SkillDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

// Skill Name
const SkillName = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Skill Description
const SkillDescription = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
`;

// Magic Damage, Heal Amount, etc.
const SkillAttribute = styled.div`
  display: flex;
  justify-content: space-between;
`;

// For the range bar, you'll need to create a custom range component.
const RangeBar = styled.div`
  height: 5px;
  background: #333;
  border-radius: 5px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 5px;
    width: ${(props) =>
      props.width}%; // This will control the filled part of the range
    background: blue;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
`;

// Using the Tooltip component
const TraitTooltip = ({
  title,
  icon,
  description,
  magicDamage,
  healAmount,
  allyHealAmount,
  rangeFilled,
}) => (
  <Tooltip>
    <Header>
      <span>{title}</span>
      <SkillIcon src={ChineseArmor.src} />
    </Header>
    <hr />
    <Body>
      <SkillDetails>
        <SkillName>
          <span>{description.title}</span>
          <span>
            <FaTint color="#1ca3ec" /> 50 / 140
          </span>
        </SkillName>
        <SkillDescription>
          <span>{description.text}</span>
        </SkillDescription>
      </SkillDetails>
    </Body>
    <Footer>
      <SkillAttribute>
        <span>Magic Damage:</span>
        <span>{magicDamage}</span>
      </SkillAttribute>
      <SkillAttribute>
        <span>Heal Amount:</span>
        <span>{healAmount}</span>
      </SkillAttribute>
      <SkillAttribute>
        <span>Ally Heal Amount:</span>
        <span>{allyHealAmount}</span>
      </SkillAttribute>
    </Footer>
    <hr />
    <RangeBar width={rangeFilled} />
  </Tooltip>
);

export default TraitTooltip;
