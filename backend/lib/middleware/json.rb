class JSONAPI
    def initialize(app)
        @app = app
    end

    def call(env)
        request = Rack::Request.new(env)
        body = request.body.read
        request.body.rewind
        if body.size > 0 && (request.content_type.include? "application/json")
            begin
                params = JSON.parse(body)
                transformed_params = JSON.dump(params.deep_transform_keys { |key| key.to_s.underscore })
                env["rack.input"] = StringIO.new(transformed_params)
                env["CONTENT_LENGTH"] = transformed_params.size
            rescue JSON::ParserError, NoMethodError
                return [ 400, { "Content-Type" => "application/json" }, [ { error: "Invalid JSON" }.to_json ] ]
            end
        end

        status, headers, response = @app.call(env)

        if headers["Content-Type"] && (headers["Content-Type"].include? "application/json")
            response_body = JSON.parse(response.body)
            response = [ JSON.dump(deep_transform_keys(response_body, :camelize, :lower)) ]
        end

        [ status, headers, response ]
    end

    private

    def deep_transform_keys(value, transform, *args)
        case value
        when Array
            value.map { |v| deep_transform_keys(v, transform, *args) }
        when Hash
            Hash[value.map { |k, v| [ k.to_s.send(transform, *args), deep_transform_keys(v, transform, *args) ] }]
        else
            value
        end
    end
end
