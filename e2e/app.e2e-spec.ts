import { DevmeetingsEventbriteDashboardPage } from './app.po';

describe('devmeetings-eventbrite-dashboard App', () => {
  let page: DevmeetingsEventbriteDashboardPage;

  beforeEach(() => {
    page = new DevmeetingsEventbriteDashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
