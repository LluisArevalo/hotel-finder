class PointsofinterestController < ApplicationController
  def create
    render(status: 201)
  end

  def get
    poi = PointOfInterest.get_by_name(params[:name])
    render(json: poi)
  end
end