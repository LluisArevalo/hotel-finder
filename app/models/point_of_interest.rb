class PointOfInterest < ActiveRecord::Base
  def self.get_by_name name
    PointOfInterest.find_by_name(name)
  end
end
