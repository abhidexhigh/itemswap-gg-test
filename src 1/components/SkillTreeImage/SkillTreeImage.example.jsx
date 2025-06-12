import React from "react";
import SkillTreeImage from "./SkillTreeImage";

// Example skill data
const exampleSkill = {
  key: "example-skill",
  name: "Example Skill",
  imageUrl: "https://example.com/skill-image.png",
  description: "This is an example skill for demonstration purposes.",
};

const SkillTreeImageExample = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">
        SkillTreeImage Component Examples
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {/* Small Size */}
        <div className="flex flex-col items-center space-y-2">
          <SkillTreeImage
            skill={exampleSkill}
            size="small"
            tooltipId="example-small"
          />
          <span className="text-white text-sm">Small (24px)</span>
        </div>

        {/* Default Size */}
        <div className="flex flex-col items-center space-y-2">
          <SkillTreeImage
            skill={exampleSkill}
            size="default"
            tooltipId="example-default"
          />
          <span className="text-white text-sm">Default (32px)</span>
        </div>

        {/* Medium Size */}
        <div className="flex flex-col items-center space-y-2">
          <SkillTreeImage
            skill={exampleSkill}
            size="medium"
            tooltipId="example-medium"
          />
          <span className="text-white text-sm">Medium (40px)</span>
        </div>

        {/* Large Size */}
        <div className="flex flex-col items-center space-y-2">
          <SkillTreeImage
            skill={exampleSkill}
            size="large"
            tooltipId="example-large"
          />
          <span className="text-white text-sm">Large (48px)</span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
        <ul className="text-gray-300 space-y-2">
          <li>• Uses custom frame from Cloudinary</li>
          <li>• Responsive sizing with predefined options</li>
          <li>• Built-in tooltip support</li>
          <li>• Optimized images with proper loading</li>
          <li>• Maintains aspect ratio</li>
          <li>• Reusable across all components</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Usage</h2>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
          {`<SkillTreeImage 
  skill={skillObject}
  size="default" // small, default, medium, large
  tooltipId="unique-id"
  className="additional-classes"
  showTooltip={true}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default SkillTreeImageExample;
