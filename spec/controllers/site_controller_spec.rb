require 'rails_helper'

RSpec.describe SiteController, type: :controller do
  
end

RSpec.describe 'site routes', type: :routing do
  it 'routes / to the site controller' do
    expect(get('/')).to route_to('site#home')
  end
end