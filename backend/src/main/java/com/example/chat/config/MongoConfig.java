package com.example.chat.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${SPRING_DATA_MONGODB_URI:mongodb://mongodb:27017/chatdb}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        return "chatdb";
    }

    @Override
    public MongoClient mongoClient() {
        // Log the URI so we can see it in the logs
        System.out.println("MONGO CONFIG: Connecting to " + mongoUri);
        return MongoClients.create(mongoUri);
    }
}
