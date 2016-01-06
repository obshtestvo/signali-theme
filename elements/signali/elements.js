import './fonts.scss';
import 'normalize.css/normalize.css';
import 'reset.scss';

import ComponentService from 'pseudo-webcomponent/skate';
var componentService = new ComponentService();

import PageElement from 'page';
componentService.register(PageElement);

import {PreloaderElement} from 'loader';
componentService.register(PreloaderElement);

import CoverElement from 'cover';
componentService.register(CoverElement);

import IntroElement from 'intro';
componentService.register(IntroElement);

import TopNavElement from 'top-nav';
componentService.register(TopNavElement);

import {ValidateBubblesAttribute, enableValidationForNonNativeInputs} from 'validation';
componentService.register(ValidateBubblesAttribute);
enableValidationForNonNativeInputs(componentService);

import 'ajax';
import ajaxOverride from './override/ajax';
ajaxOverride(componentService);

import LoginBoxElement from 'login-box';
componentService.register(LoginBoxElement);

import LogoElement from 'logo';
componentService.register(LogoElement);

import CallToActionElement from 'call-to-action';
componentService.register(CallToActionElement);

import UnderlineElement from 'underline';
componentService.register(UnderlineElement);

import ActionButtonElement from 'action-button';
componentService.register(ActionButtonElement);

import BreadcrumbElement from 'breadcrumb';
componentService.register(BreadcrumbElement);

import CrumbElement from 'crumb';
componentService.register(CrumbElement);

import TabsElement from 'tabs';
componentService.register(TabsElement);

import CheckboxElement from 'checkbox';
componentService.register(CheckboxElement);

import RadioButtonElement from 'radio-button';
componentService.register(RadioButtonElement);

import {SelectDropdownElement, TargetAttribute as SelectTargetAttribute} from 'select-dropdown';
componentService.register(SelectDropdownElement);
componentService.register(SelectTargetAttribute);

import 'value';

import SocialInsightsElement from 'social-insights';
componentService.register(SocialInsightsElement);

import MenuElement from 'menu';
componentService.register(MenuElement);

import MenuColumnElement from 'menu-column';
componentService.register(MenuColumnElement);

import HeadlineElement from 'headline';
componentService.register(HeadlineElement);

import CardsAreaElement from 'cards-area';
componentService.register(CardsAreaElement);

import CardElement from 'card';
componentService.register(CardElement);

import BubbleElement from 'bubble';
componentService.register(BubbleElement);

import 'pagination';

import CardItemElement from 'card-item';
componentService.register(CardItemElement);

import RatingElement from 'rating';
componentService.register(RatingElement);

import DonationElement from 'donation';
componentService.register(DonationElement);

import FooterWrapperElement from 'footer-wrapper';
componentService.register(FooterWrapperElement);

import FooterNavigationElement from 'footer-navigation';
componentService.register(FooterNavigationElement);

import FooterColumnElement from 'footer-column';
componentService.register(FooterColumnElement);

import SponsorsElement from 'sponsors';
componentService.register(SponsorsElement);

import TextFieldElement from 'text-field';
componentService.register(TextFieldElement);

import 'name-tag';

import FilteringElement from 'filtering';
componentService.register(FilteringElement);

import StoryElement from 'story';
componentService.register(StoryElement);

import NotificationElement from 'notification';
componentService.register(NotificationElement);

import SocialButtonElement from 'social-button';
componentService.register(SocialButtonElement);

import SettingsElement from 'settings';
componentService.register(SettingsElement);

import FiltersElement from 'filters';
componentService.register(FiltersElement);

import {ModalElement, ModalScreenElement, TargetAttribute as ModalTargetAttribute} from 'modal';
componentService.register(ModalElement);
componentService.register(ModalScreenElement);
componentService.register(ModalTargetAttribute);

import ResumeElement from 'resume';
componentService.register(ResumeElement);

import FeaturesElement from 'features';
componentService.register(FeaturesElement);

import FeatureItemElement from 'features-item';
componentService.register(FeatureItemElement);

import SurveyQuestionElement from 'survey-question';
componentService.register(SurveyQuestionElement);

import CommentsElement from 'comments';
componentService.register(CommentsElement);

import SurveyElement from 'survey';
componentService.register(SurveyElement);

import CommentElement from 'comment';
componentService.register(CommentElement);

import PopularElement from 'popular';
componentService.register(PopularElement);

import HiddenAttribute from 'hidden';
componentService.register(HiddenAttribute);

import ProposalElement from 'proposal';
componentService.register(ProposalElement);

import 'divided';

import RedirectElement from 'redirect';
componentService.register(RedirectElement);

import SignUpPromptElement from 'signup-prompt';
componentService.register(SignUpPromptElement);

import LeadingAreaElement from 'leading-area';
componentService.register(LeadingAreaElement);

import StatsElement from 'stats';
componentService.register(StatsElement);

import 'text';

import TipElement from 'tip';
componentService.register(TipElement);


import AuthModalAdapter, {
    AuthModalContainerAttribute,
    AuthChangeAttrsAttribute,
    AuthRemovesModalAttribute
} from 'auth/element-adaptors/modal';
componentService.register(AuthModalContainerAttribute);
componentService.register(AuthChangeAttrsAttribute);
componentService.register(AuthRemovesModalAttribute);

import {
    Auth,
    AuthElement,
    AuthTriggerElement,
    AuthContainerAttribute,
    AuthContainerPatchElement,
    AuthRequiredAttribute,
    SocailAuthElement,
    ResetPasswordElement,
} from 'auth'
Auth.setAdapter(AuthModalAdapter);
componentService.register(AuthElement);
componentService.register(AuthTriggerElement);
componentService.register(AuthContainerAttribute);
componentService.register(AuthContainerPatchElement);
componentService.register(AuthRequiredAttribute);
componentService.register(SocailAuthElement);
componentService.register(ResetPasswordElement);

import GoogleAnalyticsElement from 'google-analytics';
componentService.register(GoogleAnalyticsElement);

componentService.parse();