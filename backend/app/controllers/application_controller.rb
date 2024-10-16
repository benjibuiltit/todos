class ApplicationController < ActionController::API
    include JsonWebToken

    before_action :authenticate_request

    private
        def authenticate_request
            header = request.headers['Authorization']
            token = header.split(" ").last if header
            if token
                begin
                    decoded = jwt_decode(token)
                    verify_claims(decoded)
                rescue => e
                    Rails.logger.error("JWT Decode Error: #{e.message}")
                    return render json: { error: "unauthorized: invalid token" }, status: :unauthorized
                end

                @current_user = User.find(decoded[:sub])
                unless @current_user
                    return render json: { error: "unauthorized: user not found" }, status: :unauthorized
                end

            else
                return render json: { error: "unauthorized: no token provided" }, status: :unauthorized
            end
        end

end
