import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { ApiServiceService } from './Service/api-service.service';
import { environment } from 'src/environments/environment.prod';
import { getMessaging, getToken } from 'firebase/messaging';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from './Service/CommonFunctionService';
import { Subscription } from 'rxjs';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LabMaster } from './Pages/Master Module/Models/LabMaster';
import { DrawerService } from './Service/drawer.service';
import { initializeApp } from 'firebase/app';
// import { OrganizationMaster } from './Pages/Models/organization-master';
export class PasswordData {
  LOGIN_ID: any;
  OLD_PASSWORD: any;
  NEW_PASSWORD: any;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe],
})
export class AppComponent {
  isCollapsed: boolean = false;
  isLogedIn: boolean = false;
  isMobile: boolean = false;
  isSidebarOpen: boolean = false;
  sidebarHoverTimeout: any = null;
  sidebarExpandedByHover: boolean = false;
  public commonFunction = new CommonFunctionService();

  // Sidebar Navigation
  expandedGroups: { [key: string]: boolean } = {};
  showclass: boolean = false;

  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);

  USERNAME = sessionStorage.getItem('userName');
  decryptedUserName = this.USERNAME
    ? this.commonFunction.decryptdata(this.USERNAME)
    : '';

  Emaiid = sessionStorage.getItem('emailId');
  decryptedEmail = this.Emaiid
    ? this.commonFunction.decryptdata(this.Emaiid)
    : '';

  MobileNo = sessionStorage.getItem('mobile');
  year: any;
  level = Number(this.cookie.get('level'));
  menus: any[] = [];

  RoleDetails: any = sessionStorage.getItem('roledetailss');

  RoleName: any = sessionStorage.getItem('roleName');
  screenwidth = 0;
  currentroute = window.location.href;
  ROLE_ID: any;
  passwordData = new PasswordData();

  private routerSubscription: Subscription;
  constructor(
    private router: Router,
    private cookie: CookieService,
    private _notificationService: NzNotificationService,
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private drawerService: DrawerService,
    private cdr: ChangeDetectorRef
  ) {
    // this.loggerInit();
  }

  loggerInit() {
    if (
      this.cookie.get('supportKey') === '' ||
      this.cookie.get('supportKey') === null
    ) {
      this.api.loggerInit().subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.cookie.set(
              'supportKey',
              data['data'][0]['supportkey'],
              365,
              '/',
              '',
              false,
              'Strict'
            );
          }
        },
        () => { }
      );
    } else {
    }
  }

  roleDetails: any[];
  roleNames: string[] = [];
  lastlogin: any = sessionStorage.getItem('lastlogindate');
  decryptedLastLogin = this.lastlogin
    ? this.commonFunction.decryptdata(this.lastlogin)
    : '';

  private messaging;

  ngOnInit(): void {
    // Check screen size for responsive layout
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.isLogedIn = false;
      // this.api.logoutForSessionValues();
      sessionStorage.clear();
      localStorage.clear();
      this.cookie.delete('token');
      this.cookie.delete('supportKey');
      this.cookie.delete('roleId');
      this.cookie.delete('emailId');
      this.cookie.delete('userId');
      this.router.navigate(['/login']);
    } else {
      if (this.decrepteduserID && this.decreptedroleId != 0) {
        // console.log(this.decrepteduserID,'asdasdasd');
        this.isLogedIn = true;
        this.loadForms();
        this.onMasterChange(this.selectedMaster1);
        this.orgDrawer();
        // this.getSubscribeddata()
      } else {
        this.isLogedIn = false;
        // this.api.logoutForSessionValues();
        sessionStorage.clear();
        localStorage.clear();
        this.cookie.delete('token');
        this.cookie.delete('supportKey');
        this.cookie.delete('roleId');
        this.cookie.delete('emailId');
        this.cookie.delete('userId');
        this.router.navigate(['/login']);
      }
    }

    const firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(firebaseApp);

    this.requestPermission();

    this.year = new Date().getFullYear();

    this.RoleDataGet();
    const roleDetailsString: any = sessionStorage.getItem('roledetailss');
    this.roleDetails = JSON.parse(roleDetailsString);

    if (this.roleDetails) {
      this.roleDetails.forEach((role) => {
        this.roleNames.push(role.ROLE_NAME);
      });
    }

    this.lastlogin = this.datePipe.transform(
      this.decryptedLastLogin,
      'dd/MMM/yyyy, hh:mm:ss a'
    );

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Clear search query on route change
        this.searchQuery = '';
        this.showclass = false;
        // Close mobile sidebar on navigation
        if (this.isMobile) {
          this.isSidebarOpen = false;
        }
      }
    });
    this.drawerService.drawerVisible$.subscribe((status) => {
      this.visible = status;
    });
    // this.orgDrawer();
  }
  requestPermission() {
    const messaging = getMessaging();

    // console.log(messaging);
    // console.log('sadksahdks');


    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          this.cookie.set('CLOUD_ID', currentToken, 365, '', '', true, 'None');
        }
      })
      .catch((err) => {
        Notification.requestPermission().then(function (getperm) { });
      });
  }

  getSubscribeddata() {
    const subscribedChannels = sessionStorage.getItem('subscribedChannels');

    if (subscribedChannels) {
      // Parse existing channels from session
      let channelsArray = JSON.parse(subscribedChannels);

      if (Array.isArray(channelsArray) && channelsArray.length > 0) {
        // Subscribe to all channels
        const topics = channelsArray.map(
          (channel: any) => channel.CHANNEL_NAME
        );

        this.api.subscribeToMultipleTopics(topics).subscribe({
          next: () => {
            // Fetch channels not subscribed yet
            const requestBody = {
              $and: [
                { USER_ID: this.decrepteduserID },
                { STATUS: true },
                {
                  CHANNEL_NAME: {
                    $nin: channelsArray,
                  },
                },
              ],
            };

            this.api.NonSubscribedChannels(requestBody).subscribe({
              next: (response: any[]) => {
                const newChannels = response['body']['data'].map(
                  (item: any) => item.CHANNEL_NAME
                );

                if (newChannels.length > 0) {
                  this.api.subscribeToMultipleTopics(newChannels).subscribe({
                    next: () => {
                      // Merge new channels into session storage
                      const updatedChannelsArray = [
                        ...channelsArray,
                        ...newChannels.map((name) => ({ CHANNEL_NAME: name })),
                      ];
                      sessionStorage.setItem(
                        'subscribedChannels',
                        JSON.stringify(updatedChannelsArray)
                      );
                    },
                    error: (err) =>
                      console.error(
                        'Failed to subscribe to new channels:',
                        err
                      ),
                  });
                }
              },
              error: (err) =>
                console.error('Failed to get unsubscribed channels:', err),
            });
          },
          error: (err) => console.error('Failed to subscribe to topics:', err),
        });
      }
    } else {
      // No channels in session, fetch from API
      const requestBody = {
        $and: [
          { USER_ID: this.decrepteduserID },
          { STATUS: true },
          {
            CHANNEL_NAME: {
              $nin: [],
            },
          },
        ],
      };

      this.api.NonSubscribedChannels(requestBody).subscribe({
        next: (response: any[]) => {
          const newChannels = response['body']['data'].map(
            (item: any) => item.CHANNEL_NAME
          );

          if (newChannels.length > 0) {
            this.api.subscribeToMultipleTopics(newChannels).subscribe({
              next: () => {
                const updatedChannelsArray = newChannels.map((name) => ({
                  CHANNEL_NAME: name,
                }));
                sessionStorage.setItem(
                  'subscribedChannels',
                  JSON.stringify(updatedChannelsArray)
                );
              },
              error: (err) =>
                console.error('Failed to subscribe to new channels:', err),
            });
          }
        },
        error: (err) =>
          console.error('Failed to get unsubscribed channels:', err),
      });
    }
  }
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  callAfterMessageReceived() { }



  forms: any[] = [];
  allTitles: any[] = [];
  titleWiseChildren: Record<string, any[]> = {};

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Helper function to get icon type based on API response
  getIconType(iconName: string): string {
    if (!iconName) {
      return 'appstore'; // Default icon
    }

    // Convert icon name to lowercase for case-insensitive comparison
    const lowerIconName = iconName.toLowerCase();

    // Map specific icon names to Ant Design icon types
    switch (lowerIconName) {
      case 'menu':
        return 'menu';
      case 'file':
        return 'file';
      case 'home':
        return 'home';
      case 'user':
        return 'user';
      case 'setting':
      case 'settings':
        return 'setting';
      case 'dashboard':
        return 'dashboard';
      case 'form':
        return 'form';
      case 'table':
        return 'table';
      case 'chart':
      case 'graph':
        return 'bar-chart';
      case 'report':
        return 'file-text';
      case 'calendar':
        return 'calendar';
      case 'mail':
      case 'email':
        return 'mail';
      case 'notification':
      case 'bell':
        return 'bell';
      case 'search':
        return 'search';
      case 'download':
        return 'download';
      case 'upload':
        return 'upload';
      case 'edit':
      case 'update':
        return 'edit';
      case 'delete':
      case 'remove':
        return 'delete';
      case 'add':
      case 'create':
      case 'plus':
        return 'plus';
      case 'folder':
        return 'folder';
      case 'lock':
        return 'lock';
      case 'key':
        return 'key';
      case 'eye':
        return 'eye';
      case 'heart':
        return 'heart';
      case 'star':
        return 'star';
      case 'flag':
        return 'flag';
      case 'tag':
        return 'tag';
      case 'bookmark':
        return 'bookmark';
      case 'share':
        return 'share-alt';
      case 'link':
        return 'link';
      case 'phone':
        return 'phone';
      case 'mobile':
        return 'mobile';
      case 'tablet':
        return 'tablet';
      case 'laptop':
        return 'laptop';
      case 'desktop':
        return 'desktop';
      case 'camera':
        return 'camera';
      case 'video':
        return 'video-camera';
      case 'audio':
      case 'music':
      case 'sound':
        return 'sound';
      case 'picture':
      case 'image':
      case 'photo':
        return 'picture';
      case 'document':
      case 'doc':
        return 'file-text';
      case 'database':
        return 'database';
      case 'server':
        return 'server';
      case 'cloud':
        return 'cloud';
      case 'wifi':
        return 'wifi';
      case 'bluetooth':
        return 'bluetooth';
      case 'code':
      case 'programming':
        return 'code';
      case 'html':
        return 'html5';
      case 'css':
        return 'css3';
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'git':
        return 'git';
      case 'github':
        return 'github';
      case 'security':
      case 'shield':
        return 'safety';
      case 'warning':
      case 'alert':
        return 'warning';
      case 'error':
      case 'danger':
        return 'exclamation-circle';
      case 'info':
      case 'information':
        return 'info-circle';
      case 'success':
      case 'check-circle':
        return 'check-circle';
      case 'question':
      case 'help':
        return 'question-circle';
      case 'time':
      case 'clock':
        return 'clock-circle';
      case 'date':
        return 'calendar';
      case 'schedule':
        return 'calendar';
      case 'history':
        return 'history';
      case 'log':
        return 'file-text';
      case 'audit':
        return 'audit';
      case 'activity':
        return 'activity';
      case 'statistics':
      case 'stats':
        return 'bar-chart';
      case 'analytics':
        return 'line-chart';
      case 'performance':
        return 'dashboard';
      case 'health':
        return 'heart';
      case 'status':
        return 'info-circle';
      case 'progress':
        return 'progress';
      case 'loading':
      case 'spinner':
        return 'loading';
      case 'pause':
        return 'pause';
      case 'play':
        return 'play-circle';
      case 'stop':
        return 'stop';
      case 'record':
        return 'video-camera';
      case 'microphone':
      case 'mic':
        return 'audio';
      case 'speaker':
      case 'volume':
        return 'sound';
      case 'mute':
        return 'sound';
      case 'fullscreen':
        return 'fullscreen';
      case 'minimize':
        return 'shrink';
      case 'maximize':
        return 'arrows-alt';
      case 'expand':
        return 'expand';
      case 'collapse':
        return 'shrink';
      case 'zoom-in':
        return 'zoom-in';
      case 'zoom-out':
        return 'zoom-out';
      case 'reset':
      case 'clear':
        return 'clear';
      case 'exit':
      case 'logout':
        return 'logout';
      case 'login':
      case 'signin':
        return 'login';
      case 'signup':
      case 'register':
        return 'user-add';
      case 'profile':
      case 'account':
        return 'user';
      case 'avatar':
        return 'user';
      case 'contacts':
      case 'address':
        return 'contacts';
      case 'location':
      case 'map':
      case 'place':
        return 'environment';
      case 'gps':
        return 'environment';
      case 'compass':
        return 'compass';
      case 'globe':
      case 'world':
        return 'global';
      case 'language':
        return 'translation';
      case 'translate':
        return 'translation';
      case 'font':
        return 'font-size';
      case 'color':
      case 'palette':
        return 'skin';
      case 'theme':
        return 'bg-colors';
      case 'style':
        return 'skin';
      case 'design':
        return 'layout';
      case 'layout':
        return 'layout';
      case 'grid':
        return 'border';
      case 'list':
        return 'unordered-list';
      case 'card':
        return 'credit-card';
      case 'panel':
        return 'border';
      case 'window':
      case 'popup':
      case 'modal':
        return 'window';
      case 'tab':
        return 'tabs';
      case 'navigation':
      case 'nav':
        return 'compass';
      case 'breadcrumb':
        return 'right';
      case 'pagination':
        return 'ellipsis';
      case 'step':
      case 'wizard':
        return 'steps';
      case 'tour':
      case 'guide':
        return 'question-circle';
      case 'help':
      case 'support':
        return 'question-circle';
      case 'faq':
        return 'question-circle';
      case 'tutorial':
      case 'learning':
        return 'book';
      case 'education':
      case 'training':
        return 'book';
      case 'knowledge':
      case 'wiki':
        return 'book';
      case 'documentation':
      case 'docs':
        return 'file-text';
      case 'manual':
      case 'handbook':
        return 'book';
      case 'policy':
      case 'terms':
        return 'file-text';
      case 'legal':
      case 'law':
        return 'gavel';
      case 'privacy':
        return 'shield';
      case 'agreement':
      case 'contract':
        return 'file-text';
      case 'signature':
        return 'edit';
      case 'approval':
      case 'authorize':
        return 'check-circle';
      case 'reject':
      case 'decline':
        return 'close-circle';
      case 'submit':
      case 'send':
        return 'send';
      case 'cancel':
        return 'close';
      case 'confirm':
      case 'verify':
        return 'check';
      case 'validate':
      case 'check':
        return 'check';
      case 'review':
      case 'audit':
        return 'audit';
      case 'approve':
      case 'accept':
        return 'check-circle';
      case 'deny':
      case 'refuse':
        return 'close-circle';
      case 'request':
      case 'apply':
        return 'form';
      case 'back':
      case 'return':
        return 'arrow-left';
      case 'next':
      case 'forward':
        return 'arrow-right';
      case 'previous':
      case 'prev':
        return 'arrow-left';
      case 'first':
      case 'beginning':
        return 'step-backward';
      case 'last':
      case 'end':
        return 'step-forward';
      case 'top':
      case 'up':
        return 'arrow-up';
      case 'bottom':
      case 'down':
        return 'arrow-down';
      case 'left':
      case 'west':
        return 'arrow-left';
      case 'right':
      case 'east':
        return 'arrow-right';
      case 'north':
        return 'arrow-up';
      case 'south':
        return 'arrow-down';
      case 'center':
      case 'middle':
        return 'cross';
      case 'shop':
      case 'store':
        return 'shop';
      case 'cart':
      case 'shopping':
        return 'shopping-cart';
      case 'product':
        return 'gift';
      case 'order':
        return 'shopping';
      case 'invoice':
      case 'receipt':
        return 'file-text';
      case 'payment':
      case 'credit-card':
        return 'credit-card';
      case 'bank':
      case 'finance':
        return 'bank';
      case 'money':
      case 'dollar':
      case 'currency':
        return 'dollar';
      default:
        // If no specific match, try to match common patterns
        if (lowerIconName.includes('menu')) return 'menu';
        if (lowerIconName.includes('file')) return 'file';
        if (lowerIconName.includes('folder')) return 'folder';
        if (lowerIconName.includes('home')) return 'home';
        if (lowerIconName.includes('user')) return 'user';
        if (lowerIconName.includes('setting')) return 'setting';
        if (lowerIconName.includes('edit')) return 'edit';
        if (lowerIconName.includes('delete')) return 'delete';
        if (lowerIconName.includes('add')) return 'plus';
        if (lowerIconName.includes('search')) return 'search';
        if (lowerIconName.includes('download')) return 'download';
        if (lowerIconName.includes('upload')) return 'upload';
        if (lowerIconName.includes('print')) return 'printer';
        if (lowerIconName.includes('mail')) return 'mail';
        if (lowerIconName.includes('calendar')) return 'calendar';
        if (lowerIconName.includes('clock')) return 'clock-circle';
        if (lowerIconName.includes('bell')) return 'bell';
        if (lowerIconName.includes('lock')) return 'lock';
        if (lowerIconName.includes('key')) return 'key';
        if (lowerIconName.includes('eye')) return 'eye';
        if (lowerIconName.includes('heart')) return 'heart';
        if (lowerIconName.includes('star')) return 'star';
        if (lowerIconName.includes('flag')) return 'flag';
        if (lowerIconName.includes('tag')) return 'tag';
        if (lowerIconName.includes('bookmark')) return 'bookmark';
        if (lowerIconName.includes('share')) return 'share-alt';
        if (lowerIconName.includes('link')) return 'link';
        if (lowerIconName.includes('phone')) return 'phone';
        if (lowerIconName.includes('mobile')) return 'mobile';
        if (lowerIconName.includes('tablet')) return 'tablet';
        if (lowerIconName.includes('laptop')) return 'laptop';
        if (lowerIconName.includes('desktop')) return 'desktop';
        if (lowerIconName.includes('monitor')) return 'monitor';
        if (lowerIconName.includes('camera')) return 'camera';
        if (lowerIconName.includes('video')) return 'video-camera';
        if (lowerIconName.includes('audio')) return 'sound';
        if (lowerIconName.includes('picture')) return 'picture';
        if (lowerIconName.includes('image')) return 'picture';
        if (lowerIconName.includes('chart')) return 'bar-chart';
        if (lowerIconName.includes('graph')) return 'line-chart';
        if (lowerIconName.includes('report')) return 'file-text';
        if (lowerIconName.includes('document')) return 'file-text';
        if (lowerIconName.includes('pdf')) return 'file-pdf';
        if (lowerIconName.includes('excel')) return 'file-excel';
        if (lowerIconName.includes('word')) return 'file-word';
        if (lowerIconName.includes('powerpoint')) return 'file-ppt';
        if (lowerIconName.includes('zip')) return 'file-zip';
        if (lowerIconName.includes('database')) return 'database';
        if (lowerIconName.includes('server')) return 'server';
        if (lowerIconName.includes('cloud')) return 'cloud';
        if (lowerIconName.includes('wifi')) return 'wifi';
        if (lowerIconName.includes('bluetooth')) return 'bluetooth';
        if (lowerIconName.includes('usb')) return 'usb';
        if (lowerIconName.includes('code')) return 'code';
        if (lowerIconName.includes('html')) return 'html5';
        if (lowerIconName.includes('css')) return 'css3';
        if (lowerIconName.includes('javascript')) return 'javascript';
        if (lowerIconName.includes('git')) return 'git';
        if (lowerIconName.includes('github')) return 'github';
        if (lowerIconName.includes('docker')) return 'docker';
        if (lowerIconName.includes('aws')) return 'aws';
        if (lowerIconName.includes('azure')) return 'azure';
        if (lowerIconName.includes('google')) return 'google';
        if (lowerIconName.includes('security')) return 'safety';
        if (lowerIconName.includes('shield')) return 'safety';
        if (lowerIconName.includes('warning')) return 'warning';
        if (lowerIconName.includes('error')) return 'exclamation-circle';
        if (lowerIconName.includes('info')) return 'info-circle';
        if (lowerIconName.includes('success')) return 'check-circle';
        if (lowerIconName.includes('question')) return 'question-circle';
        if (lowerIconName.includes('help')) return 'question-circle';
        if (lowerIconName.includes('message')) return 'message';
        if (lowerIconName.includes('chat')) return 'message';
        if (lowerIconName.includes('team')) return 'team';
        if (lowerIconName.includes('group')) return 'team';
        if (lowerIconName.includes('organization')) return 'apartment';
        if (lowerIconName.includes('company')) return 'apartment';
        if (lowerIconName.includes('shop')) return 'shop';
        if (lowerIconName.includes('store')) return 'shop';
        if (lowerIconName.includes('cart')) return 'shopping-cart';
        if (lowerIconName.includes('shopping')) return 'shopping-cart';
        if (lowerIconName.includes('product')) return 'gift';
        if (lowerIconName.includes('order')) return 'shopping';
        if (lowerIconName.includes('invoice')) return 'file-text';
        if (lowerIconName.includes('receipt')) return 'file-text';
        if (lowerIconName.includes('payment')) return 'credit-card';
        if (lowerIconName.includes('credit-card')) return 'credit-card';
        if (lowerIconName.includes('bank')) return 'bank';
        if (lowerIconName.includes('finance')) return 'bank';
        if (lowerIconName.includes('money')) return 'dollar';
        if (lowerIconName.includes('dollar')) return 'dollar';
        if (lowerIconName.includes('currency')) return 'dollar';
        if (lowerIconName.includes('time')) return 'clock-circle';
        if (lowerIconName.includes('date')) return 'calendar';
        if (lowerIconName.includes('schedule')) return 'calendar';
        if (lowerIconName.includes('timeline')) return 'timeline';
        if (lowerIconName.includes('history')) return 'history';
        if (lowerIconName.includes('log')) return 'file-text';
        if (lowerIconName.includes('audit')) return 'audit';
        if (lowerIconName.includes('activity')) return 'activity';
        if (lowerIconName.includes('statistics')) return 'bar-chart';
        if (lowerIconName.includes('stats')) return 'bar-chart';
        if (lowerIconName.includes('analytics')) return 'line-chart';
        if (lowerIconName.includes('performance')) return 'dashboard';
        if (lowerIconName.includes('health')) return 'heart';
        if (lowerIconName.includes('status')) return 'info-circle';
        if (lowerIconName.includes('progress')) return 'progress';
        if (lowerIconName.includes('loading')) return 'loading';
        if (lowerIconName.includes('spinner')) return 'loading';
        if (lowerIconName.includes('pause')) return 'pause';
        if (lowerIconName.includes('play')) return 'play-circle';
        if (lowerIconName.includes('stop')) return 'stop';
        if (lowerIconName.includes('record')) return 'video-camera';
        if (lowerIconName.includes('microphone')) return 'audio';
        if (lowerIconName.includes('speaker')) return 'sound';
        if (lowerIconName.includes('volume')) return 'sound';
        if (lowerIconName.includes('mute')) return 'sound';
        if (lowerIconName.includes('fullscreen')) return 'fullscreen';
        if (lowerIconName.includes('minimize')) return 'shrink';
        if (lowerIconName.includes('maximize')) return 'arrows-alt';
        if (lowerIconName.includes('expand')) return 'expand';
        if (lowerIconName.includes('collapse')) return 'shrink';
        if (lowerIconName.includes('zoom-in')) return 'zoom-in';
        if (lowerIconName.includes('zoom-out')) return 'zoom-out';
        if (lowerIconName.includes('reset')) return 'clear';
        if (lowerIconName.includes('clear')) return 'clear';
        if (lowerIconName.includes('exit')) return 'logout';
        if (lowerIconName.includes('logout')) return 'logout';
        if (lowerIconName.includes('login')) return 'login';
        if (lowerIconName.includes('signin')) return 'login';
        if (lowerIconName.includes('signup')) return 'user-add';
        if (lowerIconName.includes('register')) return 'user-add';
        if (lowerIconName.includes('profile')) return 'user';
        if (lowerIconName.includes('account')) return 'user';
        if (lowerIconName.includes('avatar')) return 'user';
        if (lowerIconName.includes('contacts')) return 'contacts';
        if (lowerIconName.includes('address')) return 'contacts';
        if (lowerIconName.includes('telephone')) return 'phone';
        if (lowerIconName.includes('fax')) return 'phone';
        if (lowerIconName.includes('location')) return 'environment';
        if (lowerIconName.includes('map')) return 'environment';
        if (lowerIconName.includes('place')) return 'environment';
        if (lowerIconName.includes('gps')) return 'environment';
        if (lowerIconName.includes('compass')) return 'compass';
        if (lowerIconName.includes('globe')) return 'global';
        if (lowerIconName.includes('world')) return 'global';
        if (lowerIconName.includes('language')) return 'translation';
        if (lowerIconName.includes('translate')) return 'translation';
        if (lowerIconName.includes('font')) return 'font-size';
        if (lowerIconName.includes('color')) return 'skin';
        if (lowerIconName.includes('palette')) return 'skin';
        if (lowerIconName.includes('theme')) return 'bg-colors';
        if (lowerIconName.includes('style')) return 'skin';
        if (lowerIconName.includes('design')) return 'layout';
        if (lowerIconName.includes('layout')) return 'layout';
        if (lowerIconName.includes('grid')) return 'border';
        if (lowerIconName.includes('list')) return 'unordered-list';
        if (lowerIconName.includes('card')) return 'credit-card';
        if (lowerIconName.includes('panel')) return 'border';
        if (lowerIconName.includes('window')) return 'window';
        if (lowerIconName.includes('popup')) return 'window';
        if (lowerIconName.includes('modal')) return 'window';
        if (lowerIconName.includes('tab')) return 'tabs';
        if (lowerIconName.includes('navigation')) return 'compass';
        if (lowerIconName.includes('nav')) return 'compass';
        if (lowerIconName.includes('breadcrumb')) return 'right';
        if (lowerIconName.includes('pagination')) return 'ellipsis';
        if (lowerIconName.includes('step')) return 'steps';
        if (lowerIconName.includes('wizard')) return 'steps';
        if (lowerIconName.includes('tour')) return 'question-circle';
        if (lowerIconName.includes('guide')) return 'question-circle';
        if (lowerIconName.includes('help')) return 'question-circle';
        if (lowerIconName.includes('support')) return 'question-circle';
        if (lowerIconName.includes('faq')) return 'question-circle';
        if (lowerIconName.includes('tutorial')) return 'book';
        if (lowerIconName.includes('learning')) return 'book';
        if (lowerIconName.includes('education')) return 'book';
        if (lowerIconName.includes('training')) return 'book';
        if (lowerIconName.includes('knowledge')) return 'book';
        if (lowerIconName.includes('wiki')) return 'book';
        if (lowerIconName.includes('documentation')) return 'file-text';
        if (lowerIconName.includes('docs')) return 'file-text';
        if (lowerIconName.includes('manual')) return 'book';
        if (lowerIconName.includes('handbook')) return 'book';
        if (lowerIconName.includes('policy')) return 'file-text';
        if (lowerIconName.includes('terms')) return 'file-text';
        if (lowerIconName.includes('legal')) return 'gavel';
        if (lowerIconName.includes('law')) return 'gavel';
        if (lowerIconName.includes('privacy')) return 'shield';
        if (lowerIconName.includes('agreement')) return 'file-text';
        if (lowerIconName.includes('contract')) return 'file-text';
        if (lowerIconName.includes('signature')) return 'edit';
        if (lowerIconName.includes('approval')) return 'check-circle';
        if (lowerIconName.includes('authorize')) return 'check-circle';
        if (lowerIconName.includes('reject')) return 'close-circle';
        if (lowerIconName.includes('decline')) return 'close-circle';
        if (lowerIconName.includes('submit')) return 'send';
        if (lowerIconName.includes('send')) return 'send';
        if (lowerIconName.includes('cancel')) return 'close';
        if (lowerIconName.includes('confirm')) return 'check';
        if (lowerIconName.includes('verify')) return 'check';
        if (lowerIconName.includes('validate')) return 'check';
        if (lowerIconName.includes('review')) return 'audit';
        if (lowerIconName.includes('approve')) return 'check-circle';
        if (lowerIconName.includes('accept')) return 'check-circle';
        if (lowerIconName.includes('deny')) return 'close-circle';
        if (lowerIconName.includes('refuse')) return 'close-circle';
        if (lowerIconName.includes('request')) return 'form';
        if (lowerIconName.includes('apply')) return 'form';
        if (lowerIconName.includes('back')) return 'arrow-left';
        if (lowerIconName.includes('return')) return 'arrow-left';
        if (lowerIconName.includes('next')) return 'arrow-right';
        if (lowerIconName.includes('forward')) return 'arrow-right';
        if (lowerIconName.includes('previous')) return 'arrow-left';
        if (lowerIconName.includes('prev')) return 'arrow-left';
        if (lowerIconName.includes('first')) return 'step-backward';
        if (lowerIconName.includes('beginning')) return 'step-backward';
        if (lowerIconName.includes('last')) return 'step-forward';
        if (lowerIconName.includes('end')) return 'step-forward';
        if (lowerIconName.includes('top')) return 'arrow-up';
        if (lowerIconName.includes('bottom')) return 'arrow-down';
        if (lowerIconName.includes('left')) return 'arrow-left';
        if (lowerIconName.includes('right')) return 'arrow-right';
        if (lowerIconName.includes('north')) return 'arrow-up';
        if (lowerIconName.includes('south')) return 'arrow-down';
        if (lowerIconName.includes('east')) return 'arrow-right';
        if (lowerIconName.includes('west')) return 'arrow-left';
        if (lowerIconName.includes('center')) return 'cross';
        if (lowerIconName.includes('middle')) return 'cross';
        if (lowerIconName.includes('start')) return 'play-circle';
        if (lowerIconName.includes('begin')) return 'play-circle';
        if (lowerIconName.includes('finish')) return 'check-circle';
        if (lowerIconName.includes('complete')) return 'check-circle';
        if (lowerIconName.includes('continue')) return 'play-circle';
        if (lowerIconName.includes('resume')) return 'play-circle';
        if (lowerIconName.includes('break')) return 'pause';
        if (lowerIconName.includes('restart')) return 'redo';
        if (lowerIconName.includes('reboot')) return 'redo';
        if (lowerIconName.includes('shutdown')) return 'poweroff';
        if (lowerIconName.includes('power')) return 'poweroff';
        if (lowerIconName.includes('sleep')) return 'pause';
        if (lowerIconName.includes('hibernate')) return 'pause';
        if (lowerIconName.includes('wake')) return 'play-circle';
        if (lowerIconName.includes('standby')) return 'pause';
        if (lowerIconName.includes('idle')) return 'pause';
        if (lowerIconName.includes('busy')) return 'loading';
        if (lowerIconName.includes('working')) return 'loading';
        if (lowerIconName.includes('available')) return 'check-circle';
        if (lowerIconName.includes('free')) return 'check-circle';
        if (lowerIconName.includes('offline')) return 'disconnect';
        if (lowerIconName.includes('disconnected')) return 'disconnect';
        if (lowerIconName.includes('online')) return 'check-circle';
        if (lowerIconName.includes('connected')) return 'check-circle';
        if (lowerIconName.includes('waiting')) return 'clock-circle';
        if (lowerIconName.includes('away')) return 'user';
        if (lowerIconName.includes('invisible')) return 'eye-invisible';
        if (lowerIconName.includes('visible')) return 'eye';
        if (lowerIconName.includes('show')) return 'eye';
        if (lowerIconName.includes('hidden')) return 'eye-invisible';
        if (lowerIconName.includes('enable')) return 'check-circle';
        if (lowerIconName.includes('activate')) return 'check-circle';
        if (lowerIconName.includes('disable')) return 'close-circle';
        if (lowerIconName.includes('deactivate')) return 'close-circle';
        if (lowerIconName.includes('install')) return 'download';
        if (lowerIconName.includes('setup')) return 'download';
        if (lowerIconName.includes('uninstall')) return 'delete';
        if (lowerIconName.includes('remove')) return 'delete';
        if (lowerIconName.includes('update')) return 'sync';
        if (lowerIconName.includes('upgrade')) return 'sync';
        if (lowerIconName.includes('patch')) return 'tool';
        if (lowerIconName.includes('fix')) return 'tool';
        if (lowerIconName.includes('repair')) return 'tool';
        if (lowerIconName.includes('maintenance')) return 'tool';
        if (lowerIconName.includes('service')) return 'tool';
        if (lowerIconName.includes('backup')) return 'cloud-download';
        if (lowerIconName.includes('restore')) return 'cloud-upload';
        if (lowerIconName.includes('recovery')) return 'cloud-upload';
        if (lowerIconName.includes('archive')) return 'file-zip';
        if (lowerIconName.includes('zip')) return 'file-zip';
        if (lowerIconName.includes('extract')) return 'file-zip';
        if (lowerIconName.includes('unzip')) return 'file-zip';
        if (lowerIconName.includes('compress')) return 'file-zip';
        if (lowerIconName.includes('decompress')) return 'file-zip';
        if (lowerIconName.includes('encrypt')) return 'lock';
        if (lowerIconName.includes('secure')) return 'lock';
        if (lowerIconName.includes('decrypt')) return 'unlock';
        if (lowerIconName.includes('unlock')) return 'unlock';
        if (lowerIconName.includes('password')) return 'lock';
        if (lowerIconName.includes('pin')) return 'lock';
        if (lowerIconName.includes('fingerprint')) return 'fingerprint';
        if (lowerIconName.includes('biometric')) return 'fingerprint';
        if (lowerIconName.includes('face')) return 'user';
        if (lowerIconName.includes('recognition')) return 'user';
        if (lowerIconName.includes('iris')) return 'eye';
        if (lowerIconName.includes('scan')) return 'scan';
        if (lowerIconName.includes('voice')) return 'audio';
        if (lowerIconName.includes('speech')) return 'audio';
        if (lowerIconName.includes('pattern')) return 'border';
        if (lowerIconName.includes('gesture')) return 'border';
        if (lowerIconName.includes('two-factor')) return 'safety';
        if (lowerIconName.includes('2fa')) return 'safety';
        if (lowerIconName.includes('otp')) return 'qrcode';
        if (lowerIconName.includes('code')) return 'qrcode';
        if (lowerIconName.includes('captcha')) return 'safety';
        if (lowerIconName.includes('verification')) return 'safety';
        if (lowerIconName.includes('access')) return 'key';
        if (lowerIconName.includes('permission')) return 'key';
        if (lowerIconName.includes('role')) return 'user';
        if (lowerIconName.includes('group')) return 'team';
        if (lowerIconName.includes('member')) return 'user';
        if (lowerIconName.includes('admin')) return 'crown';
        if (lowerIconName.includes('administrator')) return 'crown';
        if (lowerIconName.includes('super')) return 'crown';
        if (lowerIconName.includes('root')) return 'crown';
        if (lowerIconName.includes('guest')) return 'user';
        if (lowerIconName.includes('visitor')) return 'user';
        if (lowerIconName.includes('public')) return 'global';
        if (lowerIconName.includes('open')) return 'global';
        if (lowerIconName.includes('private')) return 'lock';
        if (lowerIconName.includes('closed')) return 'lock';
        if (lowerIconName.includes('internal')) return 'lock';
        if (lowerIconName.includes('restricted')) return 'lock';
        if (lowerIconName.includes('external')) return 'global';
        if (lowerIconName.includes('outside')) return 'global';
        if (lowerIconName.includes('local')) return 'home';
        if (lowerIconName.includes('remote')) return 'wifi';
        if (lowerIconName.includes('network')) return 'wifi';
        if (lowerIconName.includes('usb')) return 'usb';
        if (lowerIconName.includes('port')) return 'usb';
        if (lowerIconName.includes('bluetooth')) return 'bluetooth';
        if (lowerIconName.includes('wireless')) return 'bluetooth';
        if (lowerIconName.includes('nfc')) return 'mobile';
        if (lowerIconName.includes('near-field')) return 'mobile';
        if (lowerIconName.includes('qr')) return 'qrcode';
        if (lowerIconName.includes('barcode')) return 'qrcode';
        if (lowerIconName.includes('scan')) return 'scan';
        if (lowerIconName.includes('capture')) return 'scan';
        if (lowerIconName.includes('print')) return 'printer';
        if (lowerIconName.includes('output')) return 'printer';
        if (lowerIconName.includes('fax')) return 'phone';
        if (lowerIconName.includes('transmit')) return 'phone';
        if (lowerIconName.includes('copy')) return 'copy';
        if (lowerIconName.includes('duplicate')) return 'copy';
        if (lowerIconName.includes('move')) return 'drag';
        if (lowerIconName.includes('transfer')) return 'drag';
        if (lowerIconName.includes('rename')) return 'edit';
        if (lowerIconName.includes('change')) return 'edit';
        if (lowerIconName.includes('modify')) return 'edit';
        if (lowerIconName.includes('adjust')) return 'tool';
        if (lowerIconName.includes('tune')) return 'tool';
        if (lowerIconName.includes('configure')) return 'setting';
        if (lowerIconName.includes('setup')) return 'setting';
        if (lowerIconName.includes('customize')) return 'skin';
        if (lowerIconName.includes('personalize')) return 'skin';
        if (lowerIconName.includes('preference')) return 'setting';
        if (lowerIconName.includes('option')) return 'check-square';
        if (lowerIconName.includes('selection')) return 'check-square';
        if (lowerIconName.includes('choose')) return 'check-square';
        if (lowerIconName.includes('checkbox')) return 'check-square';
        if (lowerIconName.includes('tick')) return 'check-square';
        if (lowerIconName.includes('radio')) return 'check-circle';
        if (lowerIconName.includes('switch')) return 'swap';
        if (lowerIconName.includes('toggle')) return 'swap';
        if (lowerIconName.includes('button')) return 'mouse';
        if (lowerIconName.includes('click')) return 'mouse';
        if (lowerIconName.includes('link')) return 'link';
        if (lowerIconName.includes('hyperlink')) return 'link';
        if (lowerIconName.includes('url')) return 'link';
        if (lowerIconName.includes('address')) return 'link';
        if (lowerIconName.includes('anchor')) return 'link';
        if (lowerIconName.includes('reference')) return 'link';
        if (lowerIconName.includes('bookmark')) return 'bookmark';
        if (lowerIconName.includes('favorite')) return 'bookmark';
        if (lowerIconName.includes('tag')) return 'tag';
        if (lowerIconName.includes('label')) return 'tag';
        if (lowerIconName.includes('category')) return 'appstore';
        if (lowerIconName.includes('folder')) return 'folder';
        if (lowerIconName.includes('directory')) return 'folder';
        if (lowerIconName.includes('file')) return 'file';
        if (lowerIconName.includes('document')) return 'file';
        if (lowerIconName.includes('image')) return 'picture';
        if (lowerIconName.includes('picture')) return 'picture';
        if (lowerIconName.includes('video')) return 'video-camera';
        if (lowerIconName.includes('movie')) return 'video-camera';
        if (lowerIconName.includes('audio')) return 'sound';
        if (lowerIconName.includes('music')) return 'sound';
        if (lowerIconName.includes('text')) return 'file-text';
        if (lowerIconName.includes('content')) return 'file-text';
        if (lowerIconName.includes('data')) return 'database';
        if (lowerIconName.includes('information')) return 'database';
        if (lowerIconName.includes('json')) return 'code';
        if (lowerIconName.includes('format')) return 'code';
        if (lowerIconName.includes('xml')) return 'code';
        if (lowerIconName.includes('markup')) return 'code';
        if (lowerIconName.includes('csv')) return 'file-excel';
        if (lowerIconName.includes('excel')) return 'file-excel';
        if (lowerIconName.includes('pdf')) return 'file-pdf';
        if (lowerIconName.includes('word')) return 'file-word';
        if (lowerIconName.includes('doc')) return 'file-word';
        if (lowerIconName.includes('powerpoint')) return 'file-ppt';
        if (lowerIconName.includes('ppt')) return 'file-ppt';
        if (lowerIconName.includes('zip')) return 'file-zip';
        if (lowerIconName.includes('archive')) return 'file-zip';
        if (lowerIconName.includes('rar')) return 'file-zip';
        if (lowerIconName.includes('tar')) return 'file-zip';
        if (lowerIconName.includes('gzip')) return 'file-zip';
        if (lowerIconName.includes('7z')) return 'file-zip';
        if (lowerIconName.includes('iso')) return 'file';
        if (lowerIconName.includes('img')) return 'file';
        if (lowerIconName.includes('dmg')) return 'file';
        if (lowerIconName.includes('exe')) return 'file';
        if (lowerIconName.includes('program')) return 'file';
        if (lowerIconName.includes('msi')) return 'file';
        if (lowerIconName.includes('installer')) return 'file';
        if (lowerIconName.includes('deb')) return 'file';
        if (lowerIconName.includes('package')) return 'file';
        if (lowerIconName.includes('rpm')) return 'file';
        if (lowerIconName.includes('apk')) return 'mobile';
        if (lowerIconName.includes('ios')) return 'mobile';
        if (lowerIconName.includes('app')) return 'mobile';
        if (lowerIconName.includes('application')) return 'mobile';
        if (lowerIconName.includes('software')) return 'code';
        if (lowerIconName.includes('tool')) return 'tool';
        if (lowerIconName.includes('utility')) return 'tool';
        if (lowerIconName.includes('helper')) return 'tool';
        if (lowerIconName.includes('extension')) return 'appstore';
        if (lowerIconName.includes('plugin')) return 'appstore';
        if (lowerIconName.includes('addon')) return 'appstore';
        if (lowerIconName.includes('extra')) return 'appstore';
        if (lowerIconName.includes('module')) return 'appstore';
        if (lowerIconName.includes('component')) return 'appstore';
        if (lowerIconName.includes('library')) return 'book';
        if (lowerIconName.includes('lib')) return 'book';
        if (lowerIconName.includes('framework')) return 'code';
        if (lowerIconName.includes('package')) return 'code';
        if (lowerIconName.includes('dependency')) return 'code';
        if (lowerIconName.includes('version')) return 'tags';
        if (lowerIconName.includes('release')) return 'tags';
        if (lowerIconName.includes('build')) return 'tool';
        if (lowerIconName.includes('compile')) return 'tool';
        if (lowerIconName.includes('deploy')) return 'rocket';
        if (lowerIconName.includes('publish')) return 'rocket';
        if (lowerIconName.includes('release')) return 'rocket';
        if (lowerIconName.includes('launch')) return 'rocket';
        if (lowerIconName.includes('start')) return 'rocket';
        if (lowerIconName.includes('run')) return 'play-circle';
        if (lowerIconName.includes('execute')) return 'play-circle';
        if (lowerIconName.includes('debug')) return 'bug';
        if (lowerIconName.includes('test')) return 'check-circle';
        if (lowerIconName.includes('verify')) return 'check-circle';
        if (lowerIconName.includes('unit')) return 'check-circle';
        if (lowerIconName.includes('integration')) return 'check-circle';
        if (lowerIconName.includes('e2e')) return 'check-circle';
        if (lowerIconName.includes('performance')) return 'dashboard';
        if (lowerIconName.includes('load')) return 'dashboard';
        if (lowerIconName.includes('stress')) return 'dashboard';
        if (lowerIconName.includes('security')) return 'safety';
        if (lowerIconName.includes('penetration')) return 'safety';
        if (lowerIconName.includes('vulnerability')) return 'safety';
        if (lowerIconName.includes('scan')) return 'scan';
        if (lowerIconName.includes('monitor')) return 'eye';
        if (lowerIconName.includes('track')) return 'eye';
        if (lowerIconName.includes('log')) return 'file-text';
        if (lowerIconName.includes('event')) return 'file-text';
        if (lowerIconName.includes('error')) return 'exclamation-circle';
        if (lowerIconName.includes('exception')) return 'exclamation-circle';
        if (lowerIconName.includes('warning')) return 'warning';
        if (lowerIconName.includes('alert')) return 'warning';
        if (lowerIconName.includes('info')) return 'info-circle';
        if (lowerIconName.includes('message')) return 'info-circle';
        if (lowerIconName.includes('debug')) return 'bug';
        if (lowerIconName.includes('trace')) return 'file-text';
        if (lowerIconName.includes('stack')) return 'file-text';
        if (lowerIconName.includes('heap')) return 'database';
        if (lowerIconName.includes('memory')) return 'database';
        if (lowerIconName.includes('ram')) return 'database';
        if (lowerIconName.includes('cpu')) return 'dashboard';
        if (lowerIconName.includes('processor')) return 'dashboard';
        if (lowerIconName.includes('disk')) return 'hdd';
        if (lowerIconName.includes('storage')) return 'hdd';
        if (lowerIconName.includes('network')) return 'wifi';
        if (lowerIconName.includes('connection')) return 'wifi';
        if (lowerIconName.includes('bandwidth')) return 'dashboard';
        if (lowerIconName.includes('speed')) return 'dashboard';
        if (lowerIconName.includes('latency')) return 'clock-circle';
        if (lowerIconName.includes('throughput')) return 'dashboard';
        if (lowerIconName.includes('rate')) return 'dashboard';
        if (lowerIconName.includes('uptime')) return 'check-circle';
        if (lowerIconName.includes('availability')) return 'check-circle';
        if (lowerIconName.includes('downtime')) return 'close-circle';
        if (lowerIconName.includes('outage')) return 'close-circle';
        if (lowerIconName.includes('incident')) return 'exclamation-circle';
        if (lowerIconName.includes('issue')) return 'exclamation-circle';
        if (lowerIconName.includes('problem')) return 'exclamation-circle';
        if (lowerIconName.includes('solution')) return 'tool';
        if (lowerIconName.includes('fix')) return 'tool';
        if (lowerIconName.includes('workaround')) return 'tool';
        if (lowerIconName.includes('hotfix')) return 'tool';
        if (lowerIconName.includes('patch')) return 'tool';
        if (lowerIconName.includes('update')) return 'sync';
        if (lowerIconName.includes('upgrade')) return 'sync';
        if (lowerIconName.includes('migration')) return 'drag';
        if (lowerIconName.includes('rollback')) return 'undo';
        if (lowerIconName.includes('revert')) return 'undo';
        if (lowerIconName.includes('backup')) return 'cloud-download';
        if (lowerIconName.includes('save')) return 'cloud-download';
        if (lowerIconName.includes('restore')) return 'cloud-upload';
        if (lowerIconName.includes('recover')) return 'cloud-upload';
        if (lowerIconName.includes('sync')) return 'sync';
        if (lowerIconName.includes('synchronize')) return 'sync';
        if (lowerIconName.includes('replicate')) return 'copy';
        if (lowerIconName.includes('mirror')) return 'border';
        if (lowerIconName.includes('reflect')) return 'border';
        if (lowerIconName.includes('cache')) return 'database';
        if (lowerIconName.includes('temp')) return 'database';
        if (lowerIconName.includes('temporary')) return 'database';
        if (lowerIconName.includes('session')) return 'clock-circle';
        if (lowerIconName.includes('cookie')) return 'database';
        if (lowerIconName.includes('token')) return 'key';
        if (lowerIconName.includes('jwt')) return 'key';
        if (lowerIconName.includes('oauth')) return 'key';
        if (lowerIconName.includes('saml')) return 'key';
        if (lowerIconName.includes('ldap')) return 'key';
        if (lowerIconName.includes('active')) return 'book';
        if (lowerIconName.includes('directory')) return 'book';
        if (lowerIconName.includes('certificate')) return 'safety';
        if (lowerIconName.includes('cert')) return 'safety';
        if (lowerIconName.includes('ssl')) return 'safety';
        if (lowerIconName.includes('tls')) return 'safety';
        if (lowerIconName.includes('https')) return 'safety';
        if (lowerIconName.includes('firewall')) return 'safety';
        if (lowerIconName.includes('antivirus')) return 'safety';
        if (lowerIconName.includes('malware')) return 'safety';
        if (lowerIconName.includes('virus')) return 'safety';
        if (lowerIconName.includes('spyware')) return 'safety';
        if (lowerIconName.includes('ransomware')) return 'safety';
        if (lowerIconName.includes('phishing')) return 'safety';
        if (lowerIconName.includes('spam')) return 'safety';
        if (lowerIconName.includes('adware')) return 'safety';
        if (lowerIconName.includes('trojan')) return 'safety';
        if (lowerIconName.includes('worm')) return 'safety';
        if (lowerIconName.includes('botnet')) return 'safety';
        if (lowerIconName.includes('rootkit')) return 'safety';
        if (lowerIconName.includes('keylogger')) return 'safety';
        if (lowerIconName.includes('backdoor')) return 'safety';
        if (lowerIconName.includes('exploit')) return 'safety';
        if (lowerIconName.includes('vulnerability')) return 'safety';
        if (lowerIconName.includes('threat')) return 'safety';
        if (lowerIconName.includes('attack')) return 'safety';
        if (lowerIconName.includes('breach')) return 'safety';
        if (lowerIconName.includes('incident')) return 'safety';
        if (lowerIconName.includes('response')) return 'safety';
        if (lowerIconName.includes('recovery')) return 'safety';
        if (lowerIconName.includes('compliance')) return 'safety';
        if (lowerIconName.includes('audit')) return 'audit';
        if (lowerIconName.includes('assessment')) return 'audit';
        if (lowerIconName.includes('review')) return 'audit';
        if (lowerIconName.includes('testing')) return 'safety';
        if (lowerIconName.includes('scanning')) return 'scan';
        if (lowerIconName.includes('monitoring')) return 'eye';
        if (lowerIconName.includes('detection')) return 'eye';
        if (lowerIconName.includes('prevention')) return 'safety';
        if (lowerIconName.includes('protection')) return 'safety';
        if (lowerIconName.includes('defense')) return 'safety';
        if (lowerIconName.includes('guard')) return 'safety';
        if (lowerIconName.includes('shield')) return 'safety';
        if (lowerIconName.includes('armor')) return 'safety';
        if (lowerIconName.includes('fortress')) return 'safety';
        if (lowerIconName.includes('bunker')) return 'safety';
        if (lowerIconName.includes('safe')) return 'safety';
        if (lowerIconName.includes('vault')) return 'safety';
        if (lowerIconName.includes('lock')) return 'lock';
        if (lowerIconName.includes('key')) return 'key';
        if (lowerIconName.includes('password')) return 'lock';
        if (lowerIconName.includes('pin')) return 'lock';
        if (lowerIconName.includes('biometric')) return 'fingerprint';
        if (lowerIconName.includes('fingerprint')) return 'fingerprint';
        if (lowerIconName.includes('face')) return 'user';
        if (lowerIconName.includes('iris')) return 'eye';
        if (lowerIconName.includes('voice')) return 'audio';
        if (lowerIconName.includes('pattern')) return 'border';
        if (lowerIconName.includes('gesture')) return 'border';
        if (lowerIconName.includes('behavior')) return 'user';
        if (lowerIconName.includes('anomaly')) return 'exclamation-circle';
        if (lowerIconName.includes('baseline')) return 'line';
        if (lowerIconName.includes('whitelist')) return 'check-circle';
        if (lowerIconName.includes('blacklist')) return 'close-circle';
        if (lowerIconName.includes('allowlist')) return 'check-circle';
        if (lowerIconName.includes('denylist')) return 'close-circle';
        if (lowerIconName.includes('safe')) return 'safety';
        if (lowerIconName.includes('blocked')) return 'stop';
        if (lowerIconName.includes('quarantine')) return 'exclamation-circle';
        if (lowerIconName.includes('isolate')) return 'exclamation-circle';
        if (lowerIconName.includes('contain')) return 'exclamation-circle';
        if (lowerIconName.includes('mitigate')) return 'safety';
        if (lowerIconName.includes('remediate')) return 'tool';
        if (lowerIconName.includes('fix')) return 'tool';
        if (lowerIconName.includes('patch')) return 'tool';
        if (lowerIconName.includes('update')) return 'sync';
        if (lowerIconName.includes('upgrade')) return 'sync';
        if (lowerIconName.includes('migrate')) return 'drag';
        if (lowerIconName.includes('retire')) return 'stop';
        if (lowerIconName.includes('decommission')) return 'stop';
        if (lowerIconName.includes('archive')) return 'file-zip';
        if (lowerIconName.includes('backup')) return 'cloud-download';
        if (lowerIconName.includes('restore')) return 'cloud-upload';
        if (lowerIconName.includes('disaster')) return 'exclamation-circle';
        if (lowerIconName.includes('recovery')) return 'safety';
        if (lowerIconName.includes('business')) return 'apartment';
        if (lowerIconName.includes('continuity')) return 'safety';
        if (lowerIconName.includes('risk')) return 'exclamation-circle';
        if (lowerIconName.includes('assessment')) return 'audit';
        if (lowerIconName.includes('management')) return 'setting';
        if (lowerIconName.includes('governance')) return 'audit';
        if (lowerIconName.includes('policy')) return 'file-text';
        if (lowerIconName.includes('procedure')) return 'file-text';
        if (lowerIconName.includes('guideline')) return 'file-text';
        if (lowerIconName.includes('standard')) return 'file-text';
        if (lowerIconName.includes('regulation')) return 'file-text';
        if (lowerIconName.includes('compliance')) return 'safety';
        if (lowerIconName.includes('certification')) return 'safety';
        if (lowerIconName.includes('accreditation')) return 'safety';
        if (lowerIconName.includes('audit')) return 'audit';
        if (lowerIconName.includes('review')) return 'audit';
        if (lowerIconName.includes('inspection')) return 'audit';
        if (lowerIconName.includes('verification')) return 'check-circle';
        if (lowerIconName.includes('validation')) return 'check-circle';
        if (lowerIconName.includes('testing')) return 'safety';
        if (lowerIconName.includes('assessment')) return 'audit';
        if (lowerIconName.includes('analysis')) return 'bar-chart';
        if (lowerIconName.includes('monitoring')) return 'eye';
        if (lowerIconName.includes('surveillance')) return 'eye';
        if (lowerIconName.includes('detection')) return 'eye';
        if (lowerIconName.includes('prevention')) return 'safety';
        if (lowerIconName.includes('response')) return 'safety';
        if (lowerIconName.includes('investigation')) return 'search';
        if (lowerIconName.includes('forensics')) return 'search';
        if (lowerIconName.includes('incident')) return 'exclamation-circle';
        if (lowerIconName.includes('handling')) return 'tool';
        if (lowerIconName.includes('management')) return 'setting';
        if (lowerIconName.includes('coordination')) return 'team';
        if (lowerIconName.includes('collaboration')) return 'team';
        if (lowerIconName.includes('communication')) return 'message';
        if (lowerIconName.includes('reporting')) return 'file-text';
        if (lowerIconName.includes('documentation')) return 'file-text';
        if (lowerIconName.includes('training')) return 'book';
        if (lowerIconName.includes('awareness')) return 'info-circle';
        if (lowerIconName.includes('education')) return 'book';
        if (lowerIconName.includes('phishing')) return 'exclamation-circle';
        if (lowerIconName.includes('simulation')) return 'experiment';
        if (lowerIconName.includes('exercise')) return 'experiment';
        if (lowerIconName.includes('drill')) return 'experiment';
        if (lowerIconName.includes('scenario')) return 'experiment';
        if (lowerIconName.includes('case')) return 'experiment';
        if (lowerIconName.includes('study')) return 'book';
        if (lowerIconName.includes('research')) return 'experiment';
        if (lowerIconName.includes('development')) return 'code';
        if (lowerIconName.includes('improvement')) return 'up';
        if (lowerIconName.includes('enhancement')) return 'up';
        if (lowerIconName.includes('optimization')) return 'up';
        if (lowerIconName.includes('efficiency')) return 'up';
        if (lowerIconName.includes('effectiveness')) return 'up';
        if (lowerIconName.includes('productivity')) return 'up';
        if (lowerIconName.includes('performance')) return 'up';
        if (lowerIconName.includes('reliability')) return 'up';
        if (lowerIconName.includes('availability')) return 'up';
        if (lowerIconName.includes('scalability')) return 'up';
        if (lowerIconName.includes('flexibility')) return 'up';
        if (lowerIconName.includes('adaptability')) return 'up';
        if (lowerIconName.includes('resilience')) return 'up';
        if (lowerIconName.includes('robustness')) return 'up';
        if (lowerIconName.includes('stability')) return 'up';
        if (lowerIconName.includes('consistency')) return 'up';
        if (lowerIconName.includes('accuracy')) return 'up';
        if (lowerIconName.includes('precision')) return 'up';
        if (lowerIconName.includes('quality')) return 'up';
        if (lowerIconName.includes('excellence')) return 'up';
        if (lowerIconName.includes('mastery')) return 'up';
        if (lowerIconName.includes('expertise')) return 'up';
        if (lowerIconName.includes('skill')) return 'up';
        if (lowerIconName.includes('competence')) return 'up';
        if (lowerIconName.includes('capability')) return 'up';
        if (lowerIconName.includes('capacity')) return 'up';
        if (lowerIconName.includes('ability')) return 'up';
        if (lowerIconName.includes('talent')) return 'up';
        if (lowerIconName.includes('potential')) return 'up';
        if (lowerIconName.includes('opportunity')) return 'up';
        if (lowerIconName.includes('possibility')) return 'up';
        if (lowerIconName.includes('prospect')) return 'up';
        if (lowerIconName.includes('future')) return 'up';
        if (lowerIconName.includes('vision')) return 'up';
        if (lowerIconName.includes('mission')) return 'up';
        if (lowerIconName.includes('goal')) return 'up';
        if (lowerIconName.includes('objective')) return 'up';
        if (lowerIconName.includes('target')) return 'up';
        if (lowerIconName.includes('aim')) return 'up';
        if (lowerIconName.includes('purpose')) return 'up';
        if (lowerIconName.includes('intention')) return 'up';
        if (lowerIconName.includes('plan')) return 'up';
        if (lowerIconName.includes('strategy')) return 'up';
        if (lowerIconName.includes('tactic')) return 'up';
        if (lowerIconName.includes('approach')) return 'up';
        if (lowerIconName.includes('method')) return 'up';
        if (lowerIconName.includes('technique')) return 'up';
        if (lowerIconName.includes('procedure')) return 'up';
        if (lowerIconName.includes('process')) return 'up';
        if (lowerIconName.includes('workflow')) return 'up';
        if (lowerIconName.includes('pipeline')) return 'up';
        if (lowerIconName.includes('assembly')) return 'up';
        if (lowerIconName.includes('production')) return 'up';
        if (lowerIconName.includes('manufacturing')) return 'up';
        if (lowerIconName.includes('fabrication')) return 'up';
        if (lowerIconName.includes('construction')) return 'up';
        if (lowerIconName.includes('building')) return 'up';
        if (lowerIconName.includes('architecture')) return 'up';
        if (lowerIconName.includes('design')) return 'up';
        if (lowerIconName.includes('engineering')) return 'up';
        if (lowerIconName.includes('development')) return 'up';
        if (lowerIconName.includes('implementation')) return 'up';
        if (lowerIconName.includes('deployment')) return 'up';
        if (lowerIconName.includes('operation')) return 'up';
        if (lowerIconName.includes('maintenance')) return 'up';
        if (lowerIconName.includes('support')) return 'up';
        if (lowerIconName.includes('service')) return 'up';
        if (lowerIconName.includes('delivery')) return 'up';
        if (lowerIconName.includes('distribution')) return 'up';
        if (lowerIconName.includes('logistics')) return 'up';
        if (lowerIconName.includes('supply')) return 'up';
        if (lowerIconName.includes('chain')) return 'up';
        if (lowerIconName.includes('network')) return 'up';
        if (lowerIconName.includes('infrastructure')) return 'up';
        if (lowerIconName.includes('platform')) return 'up';
        if (lowerIconName.includes('system')) return 'up';
        if (lowerIconName.includes('application')) return 'up';
        if (lowerIconName.includes('software')) return 'up';
        if (lowerIconName.includes('hardware')) return 'up';
        if (lowerIconName.includes('equipment')) return 'up';
        if (lowerIconName.includes('device')) return 'up';
        if (lowerIconName.includes('machine')) return 'up';
        if (lowerIconName.includes('instrument')) return 'up';
        if (lowerIconName.includes('tool')) return 'up';
        if (lowerIconName.includes('utility')) return 'up';
        if (lowerIconName.includes('resource')) return 'up';
        if (lowerIconName.includes('asset')) return 'up';
        if (lowerIconName.includes('property')) return 'up';
        if (lowerIconName.includes('possession')) return 'up';
        if (lowerIconName.includes('ownership')) return 'up';
        if (lowerIconName.includes('control')) return 'up';
        if (lowerIconName.includes('authority')) return 'up';
        if (lowerIconName.includes('power')) return 'up';
        if (lowerIconName.includes('influence')) return 'up';
        if (lowerIconName.includes('impact')) return 'up';
        if (lowerIconName.includes('effect')) return 'up';
        if (lowerIconName.includes('result')) return 'up';
        if (lowerIconName.includes('outcome')) return 'up';
        if (lowerIconName.includes('consequence')) return 'up';
        if (lowerIconName.includes('implication')) return 'up';
        if (lowerIconName.includes('significance')) return 'up';
        if (lowerIconName.includes('importance')) return 'up';
        if (lowerIconName.includes('value')) return 'up';
        if (lowerIconName.includes('worth')) return 'up';
        if (lowerIconName.includes('merit')) return 'up';
        if (lowerIconName.includes('benefit')) return 'up';
        if (lowerIconName.includes('advantage')) return 'up';
        if (lowerIconName.includes('profit')) return 'up';
        if (lowerIconName.includes('gain')) return 'up';
        if (lowerIconName.includes('win')) return 'up';
        if (lowerIconName.includes('success')) return 'up';
        if (lowerIconName.includes('achievement')) return 'up';
        if (lowerIconName.includes('accomplishment')) return 'up';
        if (lowerIconName.includes('completion')) return 'up';
        if (lowerIconName.includes('fulfillment')) return 'up';
        if (lowerIconName.includes('satisfaction')) return 'up';
        if (lowerIconName.includes('contentment')) return 'up';
        if (lowerIconName.includes('happiness')) return 'up';
        if (lowerIconName.includes('joy')) return 'up';
        if (lowerIconName.includes('pleasure')) return 'up';
        if (lowerIconName.includes('delight')) return 'up';
        if (lowerIconName.includes('excitement')) return 'up';
        if (lowerIconName.includes('enthusiasm')) return 'up';
        if (lowerIconName.includes('passion')) return 'up';
        if (lowerIconName.includes('interest')) return 'up';
        if (lowerIconName.includes('curiosity')) return 'up';
        if (lowerIconName.includes('wonder')) return 'up';
        if (lowerIconName.includes('amazement')) return 'up';
        if (lowerIconName.includes('surprise')) return 'up';
        if (lowerIconName.includes('astonishment')) return 'up';
        if (lowerIconName.includes('shock')) return 'up';
        if (lowerIconName.includes('disbelief')) return 'up';
        if (lowerIconName.includes('confusion')) return 'up';
        if (lowerIconName.includes('uncertainty')) return 'up';
        if (lowerIconName.includes('doubt')) return 'up';
        if (lowerIconName.includes('skepticism')) return 'up';
        if (lowerIconName.includes('suspicion')) return 'up';
        if (lowerIconName.includes('mistrust')) return 'up';
        if (lowerIconName.includes('distrust')) return 'up';
        if (lowerIconName.includes('faith')) return 'up';
        if (lowerIconName.includes('trust')) return 'up';
        if (lowerIconName.includes('confidence')) return 'up';
        if (lowerIconName.includes('belief')) return 'up';
        if (lowerIconName.includes('conviction')) return 'up';
        if (lowerIconName.includes('certainty')) return 'up';
        if (lowerIconName.includes('assurance')) return 'up';
        if (lowerIconName.includes('guarantee')) return 'up';
        if (lowerIconName.includes('promise')) return 'up';
        if (lowerIconName.includes('commitment')) return 'up';
        if (lowerIconName.includes('dedication')) return 'up';
        if (lowerIconName.includes('loyalty')) return 'up';
        if (lowerIconName.includes('fidelity')) return 'up';
        if (lowerIconName.includes('allegiance')) return 'up';
        if (lowerIconName.includes('devotion')) return 'up';
        if (lowerIconName.includes('piety')) return 'up';
        if (lowerIconName.includes('reverence')) return 'up';
        if (lowerIconName.includes('respect')) return 'up';
        if (lowerIconName.includes('esteem')) return 'up';
        if (lowerIconName.includes('admiration')) return 'up';
        if (lowerIconName.includes('appreciation')) return 'up';
        if (lowerIconName.includes('gratitude')) return 'up';
        if (lowerIconName.includes('thankfulness')) return 'up';
        if (lowerIconName.includes('recognition')) return 'up';
        if (lowerIconName.includes('acknowledgment')) return 'up';
        if (lowerIconName.includes('acceptance')) return 'up';
        if (lowerIconName.includes('approval')) return 'up';
        if (lowerIconName.includes('endorsement')) return 'up';
        if (lowerIconName.includes('support')) return 'up';
        if (lowerIconName.includes('backing')) return 'up';
        if (lowerIconName.includes('sponsorship')) return 'up';
        if (lowerIconName.includes('patronage')) return 'up';
        if (lowerIconName.includes('championship')) return 'up';
        if (lowerIconName.includes('advocacy')) return 'up';
        if (lowerIconName.includes('promotion')) return 'up';
        if (lowerIconName.includes('recommendation')) return 'up';
        if (lowerIconName.includes('suggestion')) return 'up';
        if (lowerIconName.includes('proposal')) return 'up';
        if (lowerIconName.includes('offer')) return 'up';
        if (lowerIconName.includes('bid')) return 'up';
        if (lowerIconName.includes('tender')) return 'up';
        if (lowerIconName.includes('quote')) return 'up';
        if (lowerIconName.includes('estimate')) return 'up';

        // Default fallback
        return 'appstore';
    }
  }

  // Helper function to get icon for menu titles
  getTitleIcon(title: string): string {
    // Find the form item that matches this title and return its icon
    const formItem = this.forms.find(item => item.title === title);
    return formItem?.icon || title; // Use icon from API or fallback to title
  }

  // Sidebar Navigation Methods
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSidebarMouseEnter(): void {
    if (this.isMobile || !this.isCollapsed) {
      return;
    }
    if (this.sidebarHoverTimeout) {
      clearTimeout(this.sidebarHoverTimeout);
    }
    this.sidebarHoverTimeout = setTimeout(() => {
      this.isCollapsed = false;
      this.sidebarExpandedByHover = true;
      this.sidebarHoverTimeout = null;
    }, 1000);
  }

  onSidebarMouseLeave(): void {
    if (this.sidebarHoverTimeout) {
      clearTimeout(this.sidebarHoverTimeout);
      this.sidebarHoverTimeout = null;
    }
    if (this.sidebarExpandedByHover && !this.isMobile) {
      this.isCollapsed = true;
      this.sidebarExpandedByHover = false;
    }
  }

  toggleGroup(title: string, isOpen: boolean): void {
    this.expandedGroups[title] = isOpen;
  }

  isGroupExpanded(title: string): boolean {
    // If search is active, expand groups with matching children
    if (this.showclass && this.searchQuery && this.searchQuery.length >= 3) {
      return this.hasHighlightedChildren(title);
    }
    // Return stored state or default to true
    return this.expandedGroups[title] !== false;
  }

  hasHighlightedChildren(title: string): boolean {
    const children = this.titleWiseChildren[title] || [];
    return children.some((child: any) =>
      child.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchQueryChange(event: string): void {
    this.searchQuery = event;
    this.filterForms();
  }

  // Check if mobile on init and resize
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 991;
    if (!this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  loadForms() {
    console.log('Loading forms for role:', this.decreptedroleId);
    this.api.getForms(this.decreptedroleId).subscribe(
      (data: HttpResponse<any>) => {
        console.log('Forms data received:', data);
        const statusCode = data.status;
        const datalist = data.body?.data;

        if (statusCode === 200 && datalist) {
          this.forms = datalist?.sort((a: any, b: any) => a.SEQ_NO - b.SEQ_NO);

          // Create an object that maps each title to its corresponding children
          this.titleWiseChildren = this.forms?.reduce((acc: any, item: any) => {
            const sortedChildren =
              item.children?.sort((a: any, b: any) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren;
            return acc;
          }, {});

          console.log('titleWiseChildren:', this.titleWiseChildren);
          console.log('Titles:', Object.keys(this.titleWiseChildren));

          // Initialize all groups as expanded
          Object.keys(this.titleWiseChildren).forEach((title) => {
            this.expandedGroups[title] = true;
          });

          // Build menus for potential other uses
          this.menus = this.forms;

          // Collecting all titles from the nested children arrays
          this.allTitles = this.forms.flatMap((category: any) =>
            category.children ? category.children.map((item: any) => item.title) : []
          );

          // Force change detection to update the view
          this.cdr.detectChanges();
        } else {
          console.log('No data received or invalid response');
          this.forms = [];
          this.titleWiseChildren = {};
        }
      },
      (err: HttpErrorResponse) => {
        console.error('Error loading forms:', err);
        this.forms = [];
        this.titleWiseChildren = {};
      }
    );
  }

  filterForms(): void {
    // If the search query is less than three characters, reset to original forms
    if (this.searchQuery.trim().length < 3) {
      this.titleWiseChildren = this.forms.reduce((acc, item) => {
        const sortedChildren =
          item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
        acc[item.title] = sortedChildren;
        return acc;
      }, {});
      this.showclass = false;
      return;
    }

    // Perform the filtering if the search query has at least three characters
    this.titleWiseChildren = this.forms.reduce((acc, item) => {
      const filteredChildren =
        item.children
          ?.filter((child: any) =>
            child.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
          .sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];

      if (filteredChildren.length > 0) {
        acc[item.title] = filteredChildren;
      }
      return acc;
    }, {});
    this.showclass = true;
  }

  selectedMaster: string = '';
  navigateToMaster(masterLink: string) {
    this.router.navigate([masterLink]);
  }

  sortFunction(a, b) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }

  isSpinning: boolean = false;

  // logout() {
  //   this.cookie.deleteAll();
  //   sessionStorage.clear();
  //   this._notificationService.success('Logout Successfully', '');
  //   window.location.reload();
  // this.router.navigateByUrl('/login', { replaceUrl: false });
  //   // this.router.navigate(['/login']).then(() => {
  //   //   window.location.reload();
  //   // });
  // }

  logout() {
    const subscribedChannels = sessionStorage.getItem('subscribedChannels1');

    if (subscribedChannels) {
      let channelsArray = JSON.parse(subscribedChannels);

      if (Array.isArray(channelsArray) && channelsArray.length > 0) {
        const topics = channelsArray.map(
          (channel: any) => channel.CHANNEL_NAME
        );

        this.api.unsubscribeToMultipleTopics(topics).subscribe({
          next: () => {
            // Clear subscribed channels after unsubscribing
            sessionStorage.removeItem('subscribedChannels1');
            this.finalizeLogout();
          },
          error: (err) => {
            console.error('Failed to unsubscribe from topics:', err);
            // Even if unsubscribe fails, continue with logout
            this.finalizeLogout();
          },
        });
      } else {
        this.finalizeLogout(); // No topics to unsubscribe
      }
    } else {
      this.finalizeLogout(); // No channels stored
    }
  }

  // Separate finalize method
  finalizeLogout() {
    this.cookie.deleteAll();
    sessionStorage.clear();
    this._notificationService.success('Logout Successfully', '');
    window.location.reload();
  }

  rolesData: any = [];

  RoleDataGet() {
    if (this.RoleDetails && this.RoleDetails.length > 0) {
      let tempRoleDetails: any = JSON.parse(this.RoleDetails);
      let roleIDS: any = [];
      tempRoleDetails.forEach((element) => {
        roleIDS.push(element.ROLE_ID);
      });

      this.api
        .getAllRoles(0, 0, '', '', ' AND ID in (' + roleIDS.toString() + ')')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.rolesData = data['data'];
              this.ROLE_ID = this.decreptedroleId;
            } else {
              this.rolesData = [];
            }
          },
          () => { }
        );
    } else {
      this.rolesData = [];
    }
  }

  isChangePasswordVisible = false;

  isChangePassword() {
    this.visiblesave = true;
  }

  isChangePasswordCancel() {
    this.resetForm();
    this.isChangePasswordVisible = false;
  }

  isPasswordVisible: boolean = false;
  passwordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  reEnterNewPasswordVisible: boolean = false;
  checkPasswordLoading: boolean = false;
  resetPasswordLoading: boolean = false;
  showConfirmPassword: boolean = false;
  PASSWORD: any = '';
  NEWPASSWORD: any = '';
  CONFPASSWORD: any = '';
  isLoading = false;

  checkPassword(): void {
    let isOk = true;

    // Check if all fields are undefined, null, or empty
    if (
      (!this.PASSWORD || this.PASSWORD.trim() === '') &&
      (!this.NEWPASSWORD || this.NEWPASSWORD.trim() === '') &&
      (!this.CONFPASSWORD || this.CONFPASSWORD.trim() === '')
    ) {
      isOk = false;
      this._notificationService.error(
        'Please fill all the required fields',
        ''
      );
      return;
    }

    // Check if current PASSWORD is filled
    if (!this.PASSWORD || this.PASSWORD.trim() === '') {
      isOk = false;
      this._notificationService.error('Please Enter Current Password', '');
    }

    if (isOk) {
      this.NEWPASSWORD = this.NEWPASSWORD == undefined ? '' : this.NEWPASSWORD;
      this.CONFPASSWORD =
        this.CONFPASSWORD == undefined ? '' : this.CONFPASSWORD;

      if (this.NEWPASSWORD.trim() !== '') {
        if (this.NEWPASSWORD.length < 8) {
          isOk = false;
          this._notificationService.error(
            'Password must be at least 8 characters long.',
            ''
          );
        } else if (this.PASSWORD && this.NEWPASSWORD === this.PASSWORD) {
          isOk = false;
          this._notificationService.error(
            'Change the New Password',
            'Your new password is similar to the old password. Please choose a different password.'
          );
        } else if (this.CONFPASSWORD.trim() === '') {
          isOk = false;
          this._notificationService.error('Please Enter Confirm Password.', '');
        } else if (this.NEWPASSWORD !== this.CONFPASSWORD) {
          isOk = false;
          this._notificationService.error(
            'Password Mismatch',
            'The new password and the confirmation password do not match. Please ensure both fields contain the same password.'
          );
        }
      } else {
        isOk = false;
        this._notificationService.error('Please Enter New Password', '');
      }
    }

    if (isOk) {
      this.resetPasswordLoading = true;
      this.passwordData.LOGIN_ID = this.decryptedEmail;
      this.passwordData.OLD_PASSWORD = this.PASSWORD;
      this.passwordData.NEW_PASSWORD = this.CONFPASSWORD;
      this.isLoading = true; // Show the spinner
      this.api.changePassword(this.passwordData).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.resetPasswordLoading = false;
            this._notificationService.success(
              'Password Reset Successfully',
              ''
            );
            this.resetForm();
            this.isPasswordVisible = false;
            this.isLoading = false;
            this.showConfirmPassword = false;
            this.isChangePasswordVisible = false;
          } else if (successCode['message'] == 'invalid old password ') {
            this._notificationService.info(
              'Invalid Old Password',
              'The old password you entered is incorrect. Please double-check and try again.'
            );
            this.resetPasswordLoading = false;
            this.isLoading = false;
          } else {
            this.resetPasswordLoading = false;
            this.isLoading = false;
            this._notificationService.error('Failed to Reset Password', '');
          }
        },
        () => {
          this.resetPasswordLoading = false;
          this.isLoading = false;
          this._notificationService.error('Failed to Reset Password', '');
        }
      );
    }
  }
  @ViewChild('resetform') resetform: NgForm;
  resetForm(): void {
    // Reset form fields
    this.PASSWORD = '';
    this.NEWPASSWORD = '';
    this.CONFPASSWORD = '';

    // Reset the form's dirty and touched states to avoid showing validation errors
    if (this.resetform) {
      this.resetform.resetForm();
    }
  }
  sendNotiDrawerVisible = false;
  sendNotiDrawerTitle: string;
  // @ViewChild(AddNewNotificationDrawerComponent, { static: false })
  // AddNewNotificationDrawerComponentVar: AddNewNotificationDrawerComponent;
  // add(): void {
  //   this.sendNotiDrawerVisible = true;
  //   this.sendNotiDrawerTitle = 'Send Notification';
  //   this.AddNewNotificationDrawerComponentVar.NotificationMode = 'E';
  //   // this.AddNewNotificationDrawerComponentVar.disableRadioButtons();
  //   // this.AddNewNotificationDrawerComponentVar.changeRadioButton('I');
  //   this.AddNewNotificationDrawerComponentVar.NOTI_TYPE = 'T';
  // }
  // sendNotiDrawerClose() {
  //   this.sendNotiDrawerVisible = false;

  // }

  // get sendNotiDrawerCloseCallback() {
  //   return this.sendNotiDrawerClose.bind(this);
  // }
  isNotificationVisible = false;
  notifications: any[] = [];
  filteredNotifications: any[] = [];
  expandedNotifications: { [key: number]: boolean } = {};

  tempCount: number = 0; // total count from API
  searchTerm = '';
  selectedTab = 'all';



  notificationpageIndex = 1;
  notificationpageSize = 10;
  notificationtotalRecords = 1

  // Show notification modal and fetch notifications (initial load)
  isNotification() {
    this.isNotificationVisible = true;
    this.notificationpageIndex = 1;
    this.notifications = [];
    this.expandedNotifications = {};

    this.getNotifications();
  }

  // API call
  getNotifications() {
    this.loadingNotificationDrawer = true

    this.api
      .getnotifications(
        this.notificationpageIndex,
        this.notificationpageSize,
        '',
        'desc',
        ` AND USER_ID =` + this.decrepteduserID
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            const data = response.body.data || [];
            this.notificationtotalRecords = response.body.count || 0;

            // Append paginated data
            this.notifications = [...this.notifications, ...data];

            // Filter after append
            this.filterNotifications();
          } else {
            this.notifications = [];
            this.filteredNotifications = [];
            this.notificationtotalRecords = 0;
            this.loadingNotificationDrawer = false

          }
        },
        (error: any) => {
          console.error('Error fetching notifications:', error);
          this.notifications = [];
          this.filteredNotifications = [];
          this.notificationtotalRecords = 0;
          this.loadingNotificationDrawer = false

        }
      );
  }





  // Load More
  loadMore1() {
    this.notificationpageIndex += 1;
    this.getNotifications();
  }

  // Close modal
  isNotificationCancel() {
    this.resetForm();
    this.isNotificationVisible = false;
  }

  loadingNotificationDrawer: boolean = false
  // Search filter
  filterNotifications(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // No filter → show all notifications
      this.filteredNotifications = [...this.notifications];
    } else {
      // Apply filter
      this.filteredNotifications = this.notifications.filter(notification => {
        const text = `${notification?.TITLE} ${notification?.DESCRIPTION}`.toLowerCase();
        return text.includes(this.searchTerm.toLowerCase());
      });
    }

    this.loadingNotificationDrawer = false;
    console.log(this.filteredNotifications, this.notifications);
  }


  // Search handler
  onSearch(): void {
    this.filterNotifications();
  }

  // Expand/Collapse
  toggleExpand(notificationId: number) {
    this.expandedNotifications[notificationId] =
      !this.expandedNotifications[notificationId];
  }

  getTruncatedText(text: string): string {
    return text.length > 100 ? text.slice(0, 100) + '...' : text;
  }

  // Download
  downloadDocument(attachment: string) {
    if (!attachment) return;
    const fileUrl = this.api.retriveimgUrl + 'notificationAttachment/' + attachment;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = attachment;
    link.click();
  }

  // View attachment
  viewAttachment(attachment: string) {
    window.open(this.api.retriveimgUrl + 'notificationAttachment/' + attachment);
  }


  // Profile Drawer Code
  isProfileVisible = false;

  isProfile() {
    this.isProfileVisible = true;
  }
  visible = false;
  placement: NzDrawerPlacement = 'left';
  // open(): void {
  //   this.visible = true;
  // }

  // close(): void {
  //   this.visible = false;
  // }
  close(): void {
    this.drawerService.closeDrawer();
  }

  open(): void {
    this.drawerService.openDrawer();
  }
  isProfileCancel() {
    this.resetForm();
    this.isProfileVisible = false;
  }

  public visiblesave = false;

  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }

  handleOkTop(): void {
    let isOk = true;

    // Check if all fields are undefined, null, or empty
    if (
      (!this.PASSWORD || this.PASSWORD.trim() === '') &&
      (!this.NEWPASSWORD || this.NEWPASSWORD.trim() === '') &&
      (!this.CONFPASSWORD || this.CONFPASSWORD.trim() === '')
    ) {
      isOk = false;
      this._notificationService.error(
        'Please fill all the required fields',
        ''
      );
      return;
    }

    // Check if current PASSWORD is filled
    if (!this.PASSWORD || this.PASSWORD.trim() === '') {
      isOk = false;
      this._notificationService.error('Please Enter Current Password', '');
    }

    if (isOk) {
      this.NEWPASSWORD = this.NEWPASSWORD == undefined ? '' : this.NEWPASSWORD;
      this.CONFPASSWORD =
        this.CONFPASSWORD == undefined ? '' : this.CONFPASSWORD;

      if (this.NEWPASSWORD.trim() !== '') {
        if (this.NEWPASSWORD.length < 8) {
          isOk = false;
          this._notificationService.error(
            'Password must be at least 8 characters long.',
            ''
          );
        } else if (this.PASSWORD && this.NEWPASSWORD === this.PASSWORD) {
          isOk = false;
          this._notificationService.error(
            'Change the New Password',
            'Your new password is similar to the old password. Please choose a different password.'
          );
        } else if (this.CONFPASSWORD.trim() === '') {
          isOk = false;
          this._notificationService.error('Please Enter Confirm Password.', '');
        } else if (this.NEWPASSWORD !== this.CONFPASSWORD) {
          isOk = false;
          this._notificationService.error(
            'Password Mismatch',
            'The new password and the confirmation password do not match. Please ensure both fields contain the same password.'
          );
        }
      } else {
        isOk = false;
        this._notificationService.error('Please Enter New Password', '');
      }
    }

    if (isOk) {
      this.resetPasswordLoading = true;
      this.passwordData.LOGIN_ID = this.decryptedEmail;
      this.passwordData.OLD_PASSWORD = this.PASSWORD;
      this.passwordData.NEW_PASSWORD = this.CONFPASSWORD;
      this.isLoading = true; // Show the spinner
      this.api.changePassword(this.passwordData).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.resetPasswordLoading = false;
            this._notificationService.success(
              'Password Reset Successfully',
              ''
            );
            this.resetForm();
            this.isPasswordVisible = false;
            this.isLoading = false;
            // this.showConfirmPassword = false;
            this.visiblesave = false;
            // this.isChangePasswordVisible = false;
          } else if (successCode['message'] == 'invalid old password ') {
            this._notificationService.info(
              'Invalid Old Password',
              'The old password you entered is incorrect. Please double-check and try again.'
            );
            this.resetPasswordLoading = false;
            this.isLoading = false;
          } else {
            this.resetPasswordLoading = false;
            this.isLoading = false;
            this._notificationService.error('Failed to Reset Password', '');
          }
        },
        () => {
          this.resetPasswordLoading = false;
          this.isLoading = false;
          this._notificationService.error('Failed to Reset Password', '');
        }
      );
    }
  }

  handleCancelTop(): void {
    this.resetForm();
    this.visiblesave = false;
  }

  masters = [
    { name: 'Customer', apiEndpoint: 'customer/get', url: 'masters/customers' },
    { name: 'Vendor', apiEndpoint: 'vendor/get', url: 'masters/vendor_master' },
  ];

  selectedMaster1 = this.masters[0];
  masterRecords: any[] = [];
  searchQuery: string = '';
  drawerVisible: boolean = false;
  selectedRecord: any = null;
  drawerTitle: string = '';

  onMasterChange(value: any) {
    this.selectedMaster1 = value;

    if (!this.selectedMaster1) {
      this.masterRecords = [];
      return;
    }

    this.fetchRecords(this.selectedMaster1.apiEndpoint);
  }

  fetchRecords(apiEndpoint: string) {
    this.masterRecords = []; // Clear the current records
    // this.api.getRecords(0, 0, "", "", "", apiEndpoint).subscribe({
    //   next: (records) => {
    //     this.masterRecords = records['data'];
    //   },
    //   error: (err) => {
    //     console.error('Failed to fetch records:', err);
    //   }
    // });
  }

  matchedRecord: any;
  onSearch1() {
    // if (!this.selectedMaster1) {
    //   this._notificationService.error('Please select a master and enter a search.','');
    // }

    // Search when input length is 3 or more
    if (this.searchQuery.length >= 3) {
      this.matchedRecord = this.masterRecords.find((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    } else {
      this.matchedRecord = null;
    }
  }

  onMatchedRecordClick() {
    if (this.matchedRecord) {
      this.selectedRecord = this.matchedRecord;
      this.drawerTitle = `Update ${this.selectedMaster1.name}`;
      this.router.navigate([this.selectedMaster1.url]);
      this.drawerVisible = true;
      this.searchQuery = '';
    }
  }

  closeCallback = () => {
    this.drawerVisible = false;
    this.selectedRecord = null; // Clear the selected record when closing
  };

  drawerClose = () => {
    this.drawerVisible = false;
    this.selectedRecord = null; // Optionally reset the selected record
  };

  reset() {
    this.searchQuery = '';
  }

  orgdrawerVisible: boolean = false;
  organizationData: any;
  // organizationEditData: OrganizationMaster = new OrganizationMaster();
  orgDrawer() {
    // this.api.getAllOrganizations(0, 0, "", "", "").subscribe(records => {
    //     this.organizationData = records['data'][0];
    //     console.log(this.organizationData,'organizationData');
    //   },
    //   err => {
    //     console.error('Failed to fetch records:', err);
    //   });
  }
  // drawerData: LabMaster = new LabMaster();
  countryData: any = [];
  private message: NzNotificationService;
  drawerData: LabMaster = new LabMaster();
  getCountyData(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api
      .getCountrydropdown(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.countryData = response.body.data;
        } else {
          this.countryData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  stateData: any = [];
  getStateData(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api
      .getStatedropdown(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.stateData = response.body.data;
        } else {
          this.stateData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  districtData: any = [];
  getDistrict(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getdistrict(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      if (statusCode === 200) {
        this.districtData = response.body.data;
      } else {
        this.districtData = [];
        this.message.error(`Something went wrong.`, '');
      }
    });
  }
  loadingRecords = true;
  totalRecords = 1;
  dataList: any = [];

  sortValue: string = 'desc';
  sortKey: string = 'id';

  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);

  pageIndex = 1;
  pageSize = 10;
  edit(): void {
    this.drawerTitle = 'Update Lab Information';
    this.drawerVisible = true;

    this.getStateData();
    this.getDistrict();

    const sort = '';

    this.api
      .getLabMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND ID=' + this.labID
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;
            this.drawerData = Object.assign({}, this.dataList[0]);
            this.decryptedUserName = this.drawerData.name;
          } else {
            this.dataList = [];
            this.message.error(`Something went wrong.`, '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            this.message.error(
              `HTTP Error: ${err.status}. Something Went Wrong.`,
              ''
            );
          }
        }
      );
  }

  // orgcloseCallback = () => {
  //   this.orgdrawerVisible = false;
  // };



  orgdrawerClose(): void {
    // this.search();
    this.drawerVisible = false;
  }

  //Drawer Methods
  get orgcloseCallback() {
    return this.orgdrawerClose.bind(this);
  }

  // Push Notification Drawer

  openSendNotiDrawer() {
    this.sendNotiDrawerVisible = true;
    this.sendNotiDrawerTitle = 'Push Notification';
  }
  sendNotiDrawerClose() {
    this.sendNotiDrawerVisible = false;
    // this.getnotifications();
  }

  get sendNotiDrawerCloseCallback() {
    return this.sendNotiDrawerClose.bind(this);
  }
}
