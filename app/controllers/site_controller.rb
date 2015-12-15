class SiteController < ApplicationController
  def home
    @cities = City.all
  end
end
