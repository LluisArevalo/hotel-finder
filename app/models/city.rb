class City < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  validates :latitude, presence: true
  validates :longitude, presence: true
end
