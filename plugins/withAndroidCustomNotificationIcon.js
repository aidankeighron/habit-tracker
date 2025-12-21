const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAndroidCustomNotificationIcon = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iconPath = path.join(projectRoot, 'assets', 'images', 'custom-notification-icon.png');
      
      // Target path: android/app/src/main/res/drawable/custom_notification_icon.png
      // Verify where the res directory is. Usually android/app/src/main/res
      const resDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');
      
      // We need to make sure the drawable directory exists. 
      // Sometimes resources are in drawable-hdpi etc, but 'drawable' is the default and safest for direct reference.
      const drawableDir = path.join(resDir, 'drawable');
      
      if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true });
      }

      const destination = path.join(drawableDir, 'custom_notification_icon.png');

      if (fs.existsSync(iconPath)) {
        fs.copyFileSync(iconPath, destination);
        console.log(`[withAndroidCustomNotificationIcon] Copied ${iconPath} to ${destination}`);
      } else {
        console.warn(`[withAndroidCustomNotificationIcon] Source icon not found at ${iconPath}`);
      }

      return config;
    },
  ]);
};

module.exports = withAndroidCustomNotificationIcon;
