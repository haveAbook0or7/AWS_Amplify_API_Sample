import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ルーティングモジュール
import { Routes, RouterModule } from '@angular/router';
// amplify SDKのAuthコンポーネント
import { Auth } from "aws-amplify";
// 5.で作ったサインインページとトップページ
import { SigninComponent } from './auth/signin/signin.component';
import { IndexComponent } from './page/index/index.component';

// ルーティングの設定
const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'signin', component: SigninComponent },
];

// Authコンポーネントの初期設定
Auth.configure({
  // Cognitoのあるリージョン
  region: 'ap-northeast-1',
  // CognitoのユーザプールID
  userPoolId: 'ap-northeast-1_IsFoQtCN2',
  // CognitoのアプリケーションクライアントのクライアントID
  userPoolWebClientId: '4voklua2k4clakm3m44sspt09e',
  // ログインユーザの情報を保管する場所
  storage: window.sessionStorage,
})

@NgModule({
  declarations: [
    AppComponent,
    // 5.で作ったサインインページとトップページ
    SigninComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // ルーティングの設定
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
