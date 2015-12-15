module ApplicationHelper
  def flash_message
    get_message(:notice) || get_message(:alert)
  end

  private

  def get_message(type)
    if flash[type]
      content_tag :div, class: "message col-md-12 col-xs-12 #{type.to_s}" do
        flash[type]
      end
    end
  end
end
