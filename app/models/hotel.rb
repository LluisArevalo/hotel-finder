class Hotel < ActiveRecord::Base
  belongs_to :city
  validates :name, presence: true, uniqueness: true
end
