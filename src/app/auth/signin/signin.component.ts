import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['../auth.component.css']
})
export class SigninComponent {
	// エラーメッセージ
	errorMsg: string = '';

	cognitoUserData: any;

	constructor(
		public router: Router,
	) { }

	// サインイン
	async signIn() {
		// エラーメッセージのリセット
		this.errorMsg = '';

		const loginId = document.getElementById('loginId') as HTMLInputElement | null;
		const password = document.getElementById('password') as HTMLInputElement | null;

		try {
			// サインイン
			this.cognitoUserData = await Auth.signIn(
				loginId!.value,
				password!.value
			);
			console.log(this.cognitoUserData); // TODO test

			// 他のチャレンジ(パスワード変更、多要素認証)をすべきか
			if (this.cognitoUserData.hasOwnProperty('challengeName')) {
				switch (this.cognitoUserData.challengeName) {
					case 'NEW_PASSWORD_REQUIRED':
						// 仮パスワードの場合
						const signInForm = document.getElementById('signin') as HTMLInputElement | null;
						signInForm!.className = 'auth-form disable';
						const newPasswordInit = document.getElementById('new-password-init') as HTMLInputElement | null;
						newPasswordInit!.className = 'auth-form enable';
						return;
					case 'SMS_MFA':
						// 多要素認証が必要の場合
						// Auth.confirmSignInメソッドを使用して実装する。
						return;
					case 'SOFTWARE_TOKEN_MFA':
					case 'SELECT_MFA_TYPE':
					case 'MFA_SETUP':
					case 'PASSWORD_VERIFIER':
					case 'CUSTOM_CHALLENGE':
					case 'DEVICE_SRP_AUTH':
					case 'DEVICE_PASSWORD_VERIFIER':
					case 'ADMIN_NO_SRP_AUTH':
					case 'NEW_PASSWORD_REQUIRED':
						// 万が一他の値が入っていた場合はエラーとする // TODO 後で確認
						throw new Error('Bad ChallengeName');
				}
			}

			// メニュー画面へ遷移
			this.router.navigate(['']);
		} catch (error: any) {
			console.log(error)  // TODO test
			switch (error.code) {
				case 'ForbiddenException':
				case 'InvalidLambdaResponseException':
				case 'InvalidParameterException':
				case 'InvalidSmsRoleAccessPolicyException':
				case 'InvalidSmsRoleTrustRelationshipException':
				case 'InvalidUserPoolConfigurationException':
				case 'NotAuthorizedException':
				case 'PasswordResetRequiredException':
				case 'ResourceNotFoundException':
				case 'TooManyRequestsException':
				case 'UnexpectedLambdaException':
				case 'UserLambdaValidationException':
				case 'UserNotConfirmedException':
				case 'UserNotFoundException':
				// 4xxエラー
				this.errorMsg = 'ログインIDまたはパスワードが正しくありません。';
				break;
				case 'InternalErrorException':
				case 'ServiceUnavailable':
				// 5xxエラー
				this.errorMsg = 'エラーが発生しました。';
				break;
				default:
				// その他のエラー
				this.errorMsg = 'エラーが発生しました。';
			}
		}
	}

	// 新しいパスワードを登録
	async completeNewPassword() {
			// エラーメッセージのリセット
			this.errorMsg = '';
		
			console.log('this.cognitoUserData', this.cognitoUserData)
			try {
				// cognitoUserDataが未定義ならエラー
				if (this.cognitoUserData == undefined) throw new Error('No Cognito User data')

				let cognitoUser: any;
				const password = document.getElementById('newPassword') as HTMLInputElement | null;

				// 新しいパスワードを送信してサインインを完了
				cognitoUser = await Auth.completeNewPassword(
					this.cognitoUserData,
					password!.value,
				);
				console.log(cognitoUser); // TODO test

			// 他のチャレンジ(パスワード変更、多要素認証)をすべきか
			if (cognitoUser != undefined && cognitoUser.hasOwnProperty('challengeName')) {
				switch (cognitoUser.challengeName) {
					case 'SMS_MFA':
						// 多要素認証が必要の場合
						// Auth.confirmSignInメソッドを使用して実装する。
						return;
					case 'SOFTWARE_TOKEN_MFA':
					case 'SELECT_MFA_TYPE':
					case 'MFA_SETUP':
					case 'PASSWORD_VERIFIER':
					case 'CUSTOM_CHALLENGE':
					case 'DEVICE_SRP_AUTH':
					case 'DEVICE_PASSWORD_VERIFIER':
					case 'ADMIN_NO_SRP_AUTH':
					case 'NEW_PASSWORD_REQUIRED':
						// 万が一他の値が入っていた場合はエラーとする // TODO 後で確認
						throw new Error('Bad ChallengeName');
				}
			}
		
			// メニュー画面へ遷移
			this.router.navigate(['']);
		} catch (error: any) {
			console.log(error)  // TODO test
			console.log(error.code)  // TODO test
			switch (error.code) {
				case 'AliasExistsException':
				case 'CodeMismatchException':
				case 'ExpiredCodeException':
				case 'ForbiddenException':
				case 'InvalidLambdaResponseException':
				case 'InvalidParameterException':
				case 'InvalidPasswordException':
				case 'InvalidSmsRoleTrustRelationshipException':
				case 'InvalidUserPoolConfigurationException':
				case 'MFAMethodNotFoundException':
				case 'NotAuthorizedException':
				case 'PasswordResetRequiredException':
				case 'ResourceNotFoundException':
				case 'SoftwareTokenMFANotFoundException':
				case 'TooManyRequestsException':
				case 'UnexpectedLambdaException':
				case 'UserLambdaValidationException':
				case 'UserNotConfirmedException':
				case 'UserNotFoundException':
				// 4xxエラー
				this.errorMsg = 'このパスワードは登録できません。';
				break;
				case 'InternalErrorException':
				case 'ServiceUnavailable':
				// 5xxエラー
				this.errorMsg = 'エラーが発生しました。';
				break;
				default:
				// その他のエラー
				this.errorMsg = 'エラーが発生しました。';
			}
		}
	}

}