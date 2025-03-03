package com.ezentwix.teamcostco.controller.wishlist;


import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ezentwix.teamcostco.dto.WishlistsDTO;
import com.ezentwix.teamcostco.service.LoginService;
import com.ezentwix.teamcostco.service.WishlistService;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/wishlist")
public class WishlistsController {
    private final WishlistService wishlistService;
    private final LoginService loginService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addWishlist(@RequestParam String product_code) {
        Map<String, Object> response = new HashMap<>();
        try {
            WishlistsDTO wishlistsDTO = new WishlistsDTO();
            wishlistsDTO.setProduct_code(product_code);
            wishlistsDTO.setSocial_id(loginService.getUserIdFromSession());
            wishlistService.addWishlist(wishlistsDTO);
            log.info("************** {}", wishlistsDTO);
            response.put("success", true);
            response.put("message", "위시리스트 성공적으로 추가되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "위시리스트 추가 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteWishlist(@RequestParam String product_code) {
        Map<String, Object> response = new HashMap<>();
        try {
            WishlistsDTO wishlistsDTO = new WishlistsDTO();
            wishlistsDTO.setProduct_code(product_code);
            wishlistsDTO.setSocial_id(loginService.getUserIdFromSession());
            wishlistService.addWishlist(wishlistsDTO);
            wishlistService.deleteWishlist(wishlistsDTO);
            response.put("success", true);
            response.put("message", "위시리스트에서 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "위시리스트 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
}


