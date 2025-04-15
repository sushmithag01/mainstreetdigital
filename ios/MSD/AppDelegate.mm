#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import "RNSplashScreen.h" //splash screen
#import <AuthenticationServices/AuthenticationServices.h> // facebook
#import <SafariServices/SafariServices.h> // facebook
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h> // facebook
#import <React/RCTLinkingManager.h>  // facebook
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MSD";
  self.initialProps = @{};
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
  }

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:self.moduleName
                                            initialProperties:self.initialProps];

  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
@end