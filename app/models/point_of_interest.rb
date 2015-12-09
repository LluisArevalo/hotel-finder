class PointOfInterest < ActiveRecord::Base
  
  scope :by_name, -> (name){ where("name LIKE ?", "%#{name}%") }
  scope :get_by_name, -> (name){ find_by_name(name) }
  
end
