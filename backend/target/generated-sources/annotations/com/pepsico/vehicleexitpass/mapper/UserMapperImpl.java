package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-17T21:46:16-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        if ( user.getId() != null ) {
            userDto.setId( Long.parseLong( user.getId() ) );
        }
        userDto.setEmail( user.getEmail() );

        return userDto;
    }

    @Override
    public User toEntity(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User user = new User();

        if ( userDto.getId() != null ) {
            user.setId( String.valueOf( userDto.getId() ) );
        }
        user.setEmail( userDto.getEmail() );

        return user;
    }

    @Override
    public void updateEntityFromDto(UserDto userDto, User user) {
        if ( userDto == null ) {
            return;
        }

        if ( userDto.getId() != null ) {
            user.setId( String.valueOf( userDto.getId() ) );
        }
        else {
            user.setId( null );
        }
        user.setEmail( userDto.getEmail() );
    }
}
