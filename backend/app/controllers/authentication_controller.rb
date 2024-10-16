class AuthenticationController < ApplicationController
  skip_before_action :authenticate_request

  # POST /auth/login
  def login
    @user = User.find_by_username(params[:username])
    if @user&.authenticate(params[:password])
      token = jwt_encode({ sub: @user.id, exp: 7.days.from_now.to_i })
      render json: { token: token }, status: :ok
    else
      render json: { error: "unauthorized" }, status: :unauthorized
    end
  end
end
