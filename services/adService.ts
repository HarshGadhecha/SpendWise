// AdMob Integration Service
// Note: This requires additional setup with Google AdMob

import {
  TestIds,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Ad Unit IDs (Replace with your actual AdMob IDs)
const adUnitIds = {
  banner: {
    ios: __DEV__
      ? TestIds.BANNER
      : process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID || TestIds.BANNER,
    android: __DEV__
      ? TestIds.BANNER
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID || TestIds.BANNER,
  },
  interstitial: {
    ios: __DEV__
      ? TestIds.INTERSTITIAL
      : process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID || TestIds.INTERSTITIAL,
    android: __DEV__
      ? TestIds.INTERSTITIAL
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID || TestIds.INTERSTITIAL,
  },
  rewarded: {
    ios: __DEV__
      ? TestIds.REWARDED
      : process.env.EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID || TestIds.REWARDED,
    android: __DEV__
      ? TestIds.REWARDED
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID || TestIds.REWARDED,
  },
};

class AdService {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;

  getBannerAdUnitId(): string {
    return Platform.OS === 'ios' ? adUnitIds.banner.ios : adUnitIds.banner.android;
  }

  // Initialize Interstitial Ad
  initializeInterstitialAd(): void {
    const adUnitId =
      Platform.OS === 'ios'
        ? adUnitIds.interstitial.ios
        : adUnitIds.interstitial.android;

    this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId);
    this.interstitialAd.load();
  }

  // Show Interstitial Ad
  async showInterstitialAd(): Promise<void> {
    if (!this.interstitialAd) {
      this.initializeInterstitialAd();
      return;
    }

    try {
      await this.interstitialAd.show();
      // Reload ad for next time
      this.interstitialAd.load();
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }

  // Initialize Rewarded Ad
  initializeRewardedAd(): void {
    const adUnitId =
      Platform.OS === 'ios' ? adUnitIds.rewarded.ios : adUnitIds.rewarded.android;

    this.rewardedAd = RewardedAd.createForAdRequest(adUnitId);
    this.rewardedAd.load();
  }

  // Show Rewarded Ad
  async showRewardedAd(onRewarded: () => void): Promise<void> {
    if (!this.rewardedAd) {
      this.initializeRewardedAd();
      return;
    }

    try {
      // Add reward listener
      this.rewardedAd.addAdEventListener(AdEventType.REWARDED, (reward) => {
        onRewarded();
      });

      await this.rewardedAd.show();
      // Reload ad for next time
      this.rewardedAd.load();
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    }
  }

  // Cleanup
  cleanup(): void {
    this.interstitialAd = null;
    this.rewardedAd = null;
  }
}

export const adService = new AdService();

// Example Banner Ad Component
export { BannerAd, BannerAdSize };
